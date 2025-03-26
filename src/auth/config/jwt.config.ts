import { registerAs } from '@nestjs/config'
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt'

export default registerAs('jwt', (): JwtModuleOptions => {
  return {
    secret: process.env.ACCESS_JWT_SECRET,
    signOptions: {
      expiresIn: process.env.ACCESS_JWT_EXPIRATION,
    },
  }
})
