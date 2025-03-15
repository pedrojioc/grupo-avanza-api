import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoansModule } from './loans/loans.module'
import { EmployeesModule } from './employees/employees.module'

import { environments } from './environments'
import { DatabaseModule } from './database/database.module'
import { RolesModule } from './roles/roles.module'
import { UsersModule } from './users/users.module'
import { CustomersModule } from './customers/customers.module'
import { AuthModule } from './auth/auth.module'
import { MenuModule } from './menu/menu.module'
import config from './config'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { PaymentMethodsModule } from './payment-methods/payment-methods.module'
import { NotificationsModule } from './notifications/notifications.module'
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
    }),
    LoansModule,
    EmployeesModule,
    DatabaseModule,
    RolesModule,
    UsersModule,
    CustomersModule,
    AuthModule,
    MenuModule,
    PaymentMethodsModule,
    NotificationsModule,
    TelegramBotModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_GUARD', useClass: JwtAuthGuard }],
})
export class AppModule {}
