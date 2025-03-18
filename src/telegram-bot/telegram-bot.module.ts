import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { BotUpdate } from './bot-update'
import { TelegrafModule } from 'nestjs-telegraf'
import { UsersModule } from 'src/users/users.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoansManagementModule } from 'src/loans/modules/loans-management/loans-management.module'
import { InstallmentsModule } from 'src/loans/modules/installments/installments.module'

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('Bot Token: ', configService.get('TELEGRAM_BOT_TOKEN'))
        return {
          token: configService.get('TELEGRAM_BOT_TOKEN'),
          launchOptions: {
            webhook: {
              domain: configService.get('APP_DOMAIN'),
              path: configService.get('TELEGRAM_HOOK_PATH'),
            },
          },
        }
      },
      inject: [ConfigService],
    }),
    UsersModule,
    LoansManagementModule,
    InstallmentsModule,
  ],
  providers: [AuthService, BotUpdate],
  exports: [TelegrafModule],
})
export class TelegramBotModule {}
