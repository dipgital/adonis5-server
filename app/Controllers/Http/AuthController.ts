import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

export default class AuthController {

  /**
   * Login a user
   * Barer token
   * @param {HttpContextContract} ctx
  */

  public async login({ request, auth, response }: HttpContextContract) {

    const usernameORemail = request.input('username') || request.input('email');
    const password = request.input('password');

    if (!usernameORemail || !password) {
      return response.badRequest('Missing username/email or password field');
    }

    try {

      const user = await User.findBy('username', usernameORemail) || await User.findBy('email', usernameORemail);

      if (!user) {
        return response.badRequest('Invalid username/email or password');
      }

      const token = await auth.use('jwt').login(user, {
        payload: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        expiresIn: '10day',
      });

      return token.toJSON();
    } catch (error) {
      console.log(error);
      return response.internalServerError('Failed to login');
    }

  }

  /**
   * Logout a user
   * Barer token
   * @param {HttpContextContract} ctx
  */

  public async logout({ request, auth, response }: HttpContextContract) {
    try {
      const refreshToken = request.input("refresh_token");

      if (!refreshToken) {
        return response.badRequest("Refresh token is missing");
      }

      await auth.use('jwt').logout({ refreshToken });

      return response.noContent();

    } catch (error) {
      return response.internalServerError("Failed to logout");
    }
  }

}
