import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

import { AuthService } from './services/auth.service'
import { UsersModule } from 'src/users/users.module'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthController } from './controllers/auth.controller'

import jwtConfig from './config/jwt.config'
import refreshJwtConfig from './config/refresh-jwt.config'
import { RefreshJwtStrategy } from './strategies/refresh.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    { provide: 'APP_GUARD', useClass: JwtAuthGuard },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
