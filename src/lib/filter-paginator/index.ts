import { FindManyOptions, FindOptionsWhere, Like, Repository } from 'typeorm'

interface IOptions {
  where?: object
  relations?: string[]
  itemsPerPage?: number
}

export class FilterPaginator<T> {
  private queryOptions: FindManyOptions = {
    order: { id: 'DESC' },
  }
  private repository: Repository<T>

  // Page props
  private page: number = 1
  private itemsPerPage: number = 10

  constructor(repository: Repository<T>, options?: IOptions) {
    this.repository = repository
    if (options.where) this.queryOptions.where = options.where
    if (options.relations) this.queryOptions.relations = options.relations
    if (options.itemsPerPage) this.itemsPerPage = options.itemsPerPage
  }

  filter(field: string, value: number | string) {
    if (field && value) {
      this.queryOptions = { where: { ...this.queryOptions.where, [field]: Like(`${value}%`) } }
    }

    return this
  }

  paginate(page: number) {
    this.queryOptions.take = this.itemsPerPage
    this.queryOptions.skip = this.itemsPerPage * (page - 1)
    this.page = page

    return this
  }

  async execute() {
    const [data, counter] = await this.repository.findAndCount(this.queryOptions)
    return {
      data,
      total: counter,
      currentPage: this.page,
      itemsPerPage: this.itemsPerPage,
    }
  }
}
