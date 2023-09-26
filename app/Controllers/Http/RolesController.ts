import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'

export default class RolesController {

  /**
   * Get all roles
   * Barer token required
   * permission: can-see-role
  */

  public async index({ }: HttpContextContract) {
    // get all roles
    const roles = await Role
      .query()
      .select(['id', 'name', 'slug'])

    // return json
    return roles

  }

  /**
   * Create new role
   * Barer token required
   * permission: can-create-role
   */

  public async store({ request, response }: HttpContextContract) {

    const data = request.only(['name', 'slug'])

    // check if role already exists
    const roleExists = await Role.findBy('slug', data.slug)

    if (roleExists) {
      return response.badRequest('Role already exists')
    }

    // create role
    const role = await Role.create(data)

    return role

  }

  /**
   * Get role by id
   * Barer token required
   * permission: can-see-role
   */

  public async show({ response, params }: HttpContextContract) {

    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound('Role not found')
    }

    return role

  }

  /**
   * Update role by id
   * Barer token required
   * permission: can-update-role
   */

  public async update({ request, response, params }: HttpContextContract) {

    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound('Role not found')
    }

    const data = request.only(['name', 'slug'])

    // check if role already exists
    const roleExists = await Role.findBy('slug', data.slug)

    if (roleExists) {
      return response.badRequest('Duplicate Value. Role already exists')
    }

    role.merge(data)

    await role.save()

    return role

  }

  /**
   * Delete role by id
   * Barer token required
   * permission: can-delete-role
   */

  public async destroy({ response, params }: HttpContextContract) {

    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound('Role not found')
    }

    await role.delete()

    return response.noContent()

  }

  /**
   * Assign permissions to role
   * Barer token required
   * permission: can-create-role
  */

  public async assignPermissions({ request, response, params }: HttpContextContract) {

    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound('Role not found')
    }

    // can assign multiple permissions at once
    const permissions = request.input('permissions')

    // assign permissions
    await role.related('permissions').sync(permissions)

    return response.noContent()

  }

  /**
   * Remove permissions from role
   * Barer token required
   * permission: can-update-role
  */

  public async removePermissions({ response, params }: HttpContextContract) {

    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound('Role not found')
    }

    // remove all permissions
    await role.related('permissions').sync([])

    return response.noContent()

  }

}
