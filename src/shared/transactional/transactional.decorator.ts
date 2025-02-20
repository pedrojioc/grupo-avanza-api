import { DataSource, QueryRunner } from 'typeorm'

export function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      // Obtener el DataSource de la instancia de la clase
      const dataSource: DataSource = this.dataSource

      if (!dataSource) {
        throw new Error('DataSource is not available in this service')
      }

      // Crear QueryRunner
      const queryRunner: QueryRunner = dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()

      try {
        // Pasamos el QueryRunner como último argumento del método
        const result = await originalMethod.apply(this, [...args, queryRunner.manager])

        // Hacer commit si todo salió bien
        await queryRunner.commitTransaction()
        return result
      } catch (error) {
        // Hacer rollback si hubo un error
        await queryRunner.rollbackTransaction()
        throw error
      } finally {
        // Liberar el QueryRunner
        await queryRunner.release()
      }
    }

    return descriptor
  }
}
