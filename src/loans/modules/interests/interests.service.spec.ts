import { Test, TestingModule } from '@nestjs/testing'
import { InterestsService } from './interests.service'
import { Repository } from 'typeorm'
import { Interest } from 'src/loans/entities/interest.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('InterestsService', () => {
  let service: InterestsService
  let repository: Repository<Interest>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterestsService,
        { provide: getRepositoryToken(Interest), useClass: Repository },
      ],
    }).compile()

    service = module.get<InterestsService>(InterestsService)
    repository = module.get<Repository<Interest>>(getRepositoryToken(Interest))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
