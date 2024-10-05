import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import config from './config'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, { provide: 'Config', useValue: { KEY: jest.fn() } }],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!')
    })
  })
})
