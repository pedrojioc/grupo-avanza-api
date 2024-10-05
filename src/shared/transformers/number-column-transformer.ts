export class NumberColumnTransformer {
  to(data: number): number {
    return data
  }
  from(data: string): number {
    return Number(data)
  }
}
