import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Config from '@ioc:Adonis/Core/Config'

export default class extends BaseSchema {
  protected tableName = Config.get('rolePermission.user_permission_table', 'user_permissions')

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable(Config.get('rolePermission.user_table', 'users'))
      table
        .integer('permission_id')
        .unsigned()
        .references('id')
        .inTable(Config.get('rolePermission.permission_table', 'permissions'))

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
