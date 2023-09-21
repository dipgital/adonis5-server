import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Permission from './Permission'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',  // nama tabel pivot
    localKey: 'id',           // kolom kunci di tabel ini (users)
    pivotForeignKey: 'user_id', // kolom kunci asing di tabel pivot yang merujuk ke tabel ini
    relatedKey: 'id',        // kolom kunci di tabel yang berelasi (roles)
    pivotRelatedForeignKey: 'role_id', // kolom kunci asing di tabel pivot yang merujuk ke tabel yang berelasi
  })
  public roles: ManyToMany<typeof Role>

  @manyToMany(() => Permission, {
    pivotTable: 'user_permission_table',  // Nama tabel pivot Anda
  })
  public permissions: ManyToMany<typeof Permission>

}
