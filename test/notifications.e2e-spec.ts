import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { AppModule } from '../src/app.module'
import { authenticate } from 'test/helpers/login'
import { DatabaseSeeder } from 'src/database/database-seeder'

describe('Notifications E2E', () => {
  let app: INestApplication
  let hostServer: string
  let accessToken: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [DatabaseSeeder],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    hostServer = app.getHttpServer()
    accessToken = await authenticate(hostServer)
  })

  afterAll(async () => {
    await app.close()
  })

  it('/notifications/run/whatsapp (POST)', () => {
    return request(app.getHttpServer())
      .post('/notifications/run/whatsapp')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(201)
      .expect('Content-Type', /json/)
  })

  // Add more tests here
})
