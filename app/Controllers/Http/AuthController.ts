import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AuthController {

  /**
   * Login a user
   * Barer token
   * @param {HttpContextContract} ctx
  */

  public async login({ request, auth, response }: HttpContextContract) {

    const username = request.input('username');
    const email = request.input('email');
    const password = request.input('password');

    try {
      const token = await auth.use('jwt').attempt(username || email, password, {
        expiresIn: '10 days'
      });

      return token.toJSON();
    } catch (error) {
      console.log(error);
      return response.badRequest('Invalid credentials');
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
