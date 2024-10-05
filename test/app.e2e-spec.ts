import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(() => {
    app.close()
  })

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'pedro', password: 'pedro.123' })

    const accessToken = response.body.access_token
    return request(app.getHttpServer())
      .get('/')
      .set({
        Authorization: `Bearer ${accessToken}`,
      })
      .expect(200)
      .expect('Hello World!')
  })
})
