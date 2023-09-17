import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

const roleTable = Config.get('rolePermission.role_table', 'roles')
const userRoleTable = Config.get('rolePermission.user_role_table', 'user_roles')

/**
 * Role authentication to check if user has any of the specified roles
 *
 * Should be called after auth middleware
 */
export default class Role {
  /**
   * Handle request
   */
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    roleNames: string[]
  ) {
    /**
     * Check if user is logged-in or not.
     */
    let user = await auth.user
    if (!user) {
      return response.unauthorized({ error: 'Must be logged in' })
    }
    let hasRole = await this.checkHasRoles(auth.user, roleNames)
    if (!hasRole) {
      return response.unauthorized({
        error: `Doesn't have required role(s): ${roleNames.join(',')}`,
      })
    }
    await next()
  }

  // private async checkHasRoles(user: User, roleNames: Array<string>): Promise<boolean> {
  //   const roleCount = await Database.from(userRoleTable)
  //     .innerJoin(roleTable, `${userRoleTable}.role_id`, `${roleTable}.id`)
  //     .where(`${userRoleTable}.user_id`, user.id)
  //     .whereIn(`${roleTable}.name`, roleNames)
  //     .count('*', { as: 'roleCount' })
  //     .first();

  //   return roleCount && Number(roleCount.roleCount) > 0;
  // }

  private async checkHasRoles(user: User, roleNames: Array<string>): Promise<boolean> {
    const roles = await Database.from(userRoleTable)
      .innerJoin(roleTable, `${userRoleTable}.role_id`, `${roleTable}.id`)
      .where(`${userRoleTable}.user_id`, user.id)
      .whereIn(`${roleTable}.name`, roleNames)
      .count('* as roleCount');

    const roleCount = roles[0]?.roleCount || 0;

    return Number(roleCount) > 0;
  }
}
