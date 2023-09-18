import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

const permissionTable = Config.get('permission_table', 'permissions')
const userPermissionTable = Config.get('user_permission_table', 'user_permissions')
const rolePermissionTable = Config.get('role_permission_table', 'role_permissions')

/**
 * Permission authentication to check if user has any of the specified permissions
 *
 * Should be called after auth middleware
 */
export default class Permission {
  /**
   * Handle request
   */
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    permissionNames: string[]
  ) {
    /**
     * Check if user is logged-in
     */

    let user = await auth.use('jwt').user

    if (!user) {
      return response.unauthorized({ error: 'Must be logged in' })
    }

    /**
     * Check if user has any of the specified permissions
     * If not, return 401
     */

    let hasPermission = await this.checkHasPermissions(user, permissionNames)
    // console.log(user, hasPermission)
    if (!hasPermission) {
      return response.unauthorized({
        error: 'You are not authorized to access this resource',
      })
    }


  }
}
