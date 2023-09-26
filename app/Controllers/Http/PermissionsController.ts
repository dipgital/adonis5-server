import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'

export default class PermissionsController {

  /**
   * Get all permissions
   * Barer token required
   * permission: can-see-permission
  */

  public async index({ }: HttpContextContract) {
    // get all permissions
    const permissions = await Permission
      .query()
      .select(['id', 'name', 'slug'])

    // return json
    return permissions

  }

  /**
   * Create new permission
   * Barer token required
   * permission: can-create-permission
  */

  public async store({ request }: HttpContextContract) {

    const data = request.only(['name', 'slug'])

    // create permission
    const permission = await Permission.create(data)

    return permission

  }

  /**
   * Get permission by id
   * Barer token required
   * permission: can-see-permission
  */

  public async show({ response, params }: HttpContextContract) {

    const permission = await Permission.find(params.id)

    if (!permission) {
      return response.notFound('Permission not found')
    }

    return permission

  }

  /**
   * Update permission by id
   * Barer token required
   * permission: can-update-permission
   */

  public async update({ request, response, params }: HttpContextContract) {

    const permission = await Permission.find(params.id)

    if (!permission) {
      return response.notFound('Permission not found')
    }

    const data = request.only(['name', 'slug'])

    permission.merge(data)

    await permission.save()

    return permission

  }

  /**
   * Delete permission by id
   * Barer token required
   * permission: can-delete-permission
   */

  public async destroy({ response, params }: HttpContextContract) {

    const permission = await Permission.find(params.id)

    if (!permission) {
      return response.notFound('Permission not found')
    }

    await permission.delete()

    return response.noContent()

  }
}
