import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'
import User from 'App/Models/User'
import PermissionModel from 'App/Models/Permission'

const permissionTable = Config.get('permission_table', 'permissions')
const userPermissionTable = Config.get('user_permission_table', 'user_permissions')
const rolePermissionTable = Config.get('role_permission_table', 'role_permissions')

export default class Permission {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    [slug]: [string]
  ) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ error: 'Must be logged in' })
    }

    const hasPermission = await this.checkHasPermission(user, slug)

    if (!hasPermission) {
      return response.unauthorized({
        error: 'You are not authorized to access this resource',
      })
    }

    await next()
  }

  private async checkHasPermission(user: User, slug: string): Promise<boolean> {
    const directPermission = await PermissionModel
      .query()
      .where('slug', slug)
      .whereHas('users', (query) => {
        query.where('users.id', user.id) // Menggunakan 'id' bukan 'user_id'
      })
      .first()

    if (directPermission) {
      return true
    }

    const rolePermission = await PermissionModel
      .query()
      .where('slug', slug)
      .whereHas('roles', (query) => {
        query.whereHas('users', (subQuery) => {
          subQuery.where('users.id', user.id) // Menggunakan 'id' bukan 'user_id'
        })
      })
      .first()

    return !!rolePermission
  }
}
