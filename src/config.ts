import { registerAs } from '@nestjs/config'

export default registerAs('config', () => ({
  mysql: {
    type: 'mysql',
    port: Number(process.env.DATABASE_PORT),
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  postgresql: {
    type: 'postgresql',
  },
  jwtSecret: process.env.JWT_SECRET,
  KEY: 'asd',
  whatsAppToken: process.env.WHATSAPP_TOKEN,
}))
