import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { AxiosResponse } from 'axios'
import { map } from 'rxjs'
import { WhatsAppForDelayDto } from './dtos/whatsapp-for-delay.dto'

@Injectable()
export class WhatsAppService {
  SUPPORT_NUMBER = '573135948595'
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async sendMessage(messageData: WhatsAppForDelayDto) {
    const body = JSON.stringify({
      messaging_product: 'whatsapp',
      to: '573135948595',
      type: 'template',
      template: {
        name: 'pago_atrasado',
        language: {
          code: 'es_CO',
        },
        components: [
          { type: 'header', parameters: [{ type: 'text', parameter_name: 'icon', text: '📢' }] },
          {
            type: 'body',
            parameters: [
              { type: 'text', parameter_name: 'name', text: messageData.name },
              { type: 'text', parameter_name: 'days_late', text: messageData.days_late },
              { type: 'text', parameter_name: 'pending_amount', text: messageData.pending_amount },
              { type: 'text', parameter_name: 'contact_number', text: this.SUPPORT_NUMBER },
            ],
          },
        ],
      },
    })

    const wToken = this.configService.get('WHATSAPP_TOKEN')

    const config = {
      headers: {
        Authorization: `Bearer ${wToken}`,
        'Content-Type': 'application/json',
      },
    }

    try {
      const response = this.httpService
        .post('https://graph.facebook.com/v21.0/590691844118476/messages', body, config)
        .pipe(
          map((response: AxiosResponse) => {
            console.log('respuesta: ', response)
            return response.data
          }),
        )

      return response
    } catch (error) {
      console.log(error)
    }
  }
}
