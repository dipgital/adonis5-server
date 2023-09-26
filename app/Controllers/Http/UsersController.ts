import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {

  /**
   * Get all users
   * Barer token required
   * permission: can-see-user
  */

  public async index({  }: HttpContextContract) {
    // get all users
    const users = await User
      .query()
      .select(['id', 'username', 'email'])
      .preload('roles', (query) => {
        query.select(['id', 'name'])
      })

    // return json
    return users

  }

  /**
   * Create new user
   * Barer token required
   * permission: can-create-user
  */

  public async store({ request }: HttpContextContract) {

      const data = request.only(['username', 'email', 'password'])
      const roles = request.input('roles')

      // create user
      const user = await User.create(data)

      // assign roles
      if (roles.length > 0) {
        console.log(roles.name)
        await user.related('roles').attach(roles)

      }

      await user.load('roles')

      return user

  }

  /**
   * Get user by id
   * Barer token required
   * permission: can-see-user
  */

  public async show({ response, params }: HttpContextContract) {

    const user = await User
      .query()
      .where('id', params.id)
      .select(['id', 'username', 'email'])
      .preload('roles', (query) => {
        query.select(['id', 'name'])
      })
      .firstOrFail()

    if (!user) {
      return response.notFound(
        { error: 'User not found.' }
      )
    }

    return user
  }

  /**
   * update user
   * Barer token required
   * permission: can-edit-user
  */

  public async update({ request, response, params }: HttpContextContract) {

    const user = await User.findOrFail(params.id)
    if (!user) {

      return response.notFound({ error: 'User not found.' })

    }

    const data = request.only(['username', 'email', 'password'])
    const roles = request.input('roles')

    // update user
    user.merge(data)
    await user.save()

    // assign roles
    if (roles.length > 0) {

      await user.related('roles').sync(roles)

    }

    await user.load('roles')

    return user

  }

  /**
   * delete user
   * Barer token required
   * permission: can-delete-user
  */

  public async destroy({ response, params }: HttpContextContract) {

    const user = await User.findOrFail(params.id)
    if (!user) {

      return response.notFound({ error: 'User not found.' })

    }

    await user.delete()

    return response.ok({ message: 'User deleted successfully.' })
  }

}
