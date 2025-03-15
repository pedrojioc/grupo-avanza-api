import { Command, Ctx, On, Start, Update } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { AuthService } from './auth.service'
import { Public } from 'src/auth/decorators/public.decorator'

@Update()
export class BotUpdate {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Start()
  async onStart(@Ctx() ctx: Context) {
    ctx.reply('Bienvenido! Use /login para autenticarse')
  }

  @Public()
  @Command('help')
  async onHelp(@Ctx() ctx: Context) {
    ctx.reply(
      `Comandos disponibles:\n` +
        `/login - Iniciar autenticación\n` +
        `/status - Verificar el estado de autenticación\n` +
        `/help - Mostrar este mensaje de ayuda`,
    )
  }

  @Public()
  @Command('status')
  async onStatus(@Ctx() ctx: Context) {
    const chatId = ctx.chat.id
    const user = await this.authService.getUserByChatId(chatId)

    if (user) {
      ctx.reply(`Estás autenticado como ${user.username}.`)
    } else {
      ctx.reply('No estás autenticado. Selecciona la opción Autenticarme')
    }
  }

  @Public()
  @Command('login')
  async onLogin(@Ctx() ctx: Context) {
    ctx.reply('Ingresa tu username para autenticarte.')
  }

  @Public()
  @On('text')
  async onText(@Ctx() ctx: Context) {
    const chatId = ctx.chat.id

    let text: string
    if ('text' in ctx.message) {
      text = ctx.message.text.trim()
    } else {
      ctx.reply('Entrada inválida')
      return
    }
    // Si el usuario está autenticado, no hace falta procesar nada
    const user = await this.authService.getUserByChatId(chatId)
    if (user) {
      ctx.reply(`Ya has iniciado sesión como ${user.username}`)
      return
    }

    // Si el usuario ha ingresado un código de verificación
    if (text.match(/^\d{6}$/)) {
      const verified = await this.authService.verifyCode(chatId, text)
      ctx.reply(
        verified ? 'Autenticación exitosa!' : 'El código expiró o es inválido, intenta nuevamente.',
      )
      return
    }

    // Si el usuario ha ingresado su username
    const success = await this.authService.sendVerificationCode(text, chatId)
    ctx.reply(
      success
        ? 'Un código de verificación ha sido enviado a tu email. Ingresa el código'
        : 'Usuario no encontrado',
    )
  }
}
