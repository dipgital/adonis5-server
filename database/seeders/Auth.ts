import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {

    /**
     * create roles
     * using createMany
     * tabel : roles
    */

    const superAdminRole = await Role.create({
      name: 'superadmin',
      slug: 'superadmin',
      description: 'superadmin',
    })

    const userRole = await Role.create({
      name: 'user',
      slug: 'user',
      description: 'user',
    })

    /**
     * create permissions
     * using createMany
     * tabel : permissions
    */

    const permissions = await Permission.createMany([
      // users permissions
      {
        name: 'can see user',
        slug: 'can-see-user',
        description: 'can see all users or a single user',
      },
      {
        name: 'can create user',
        slug: 'can-create-user',
        description: 'can create a user',
      },
      {
        name: 'can update user',
        slug: 'can-update-user',
        description: 'can update a user',
      },
      {
        name: 'can delete user',
        slug: 'can-delete-user',
        description: 'can delete a user',
      },

      // roles permissions
      {
        name: 'can-see-role',
        slug: 'can-see-role',
        description: 'can see all roles or a single role',
      },
      {
        name: 'can create role',
        slug: 'can-create-role',
        description: 'can create a role',
      },
      {
        name: 'can update role',
        slug: 'can-update-role',
        description: 'can update a role',
      },
      {
        name: 'can delete role',
        slug: 'can-delete-role',
        description: 'can delete a role',
      },

      // permissions permissions
      {
        name: 'can see permission',
        slug: 'can-see-permission',
        description: 'can see all permissions or a single permission',
      },
      {
        name: 'can create permission',
        slug: 'can-create-permission',
      },
      {
        name: 'can update permission',
        slug: 'can-update-permission',
      },
      {
        name: 'can delete permission',
        slug: 'can-delete-permission',
      },

    ])

    /**
     * create users
     * using createMany
     * tabel : users
    */

    const superAdmin = await User.create({
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: 'password',
    })

    const user = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'password',
    })

        /**
     * attach permissions to roles
     * using attach
     * tabel : role_permissions
    */

        await superAdminRole.related('permissions').attach(permissions.map((permission) => permission.id))

    /**
     * attach roles to users
     * using attach
     * tabel : user_roles
     * column : user_id, role_id
    */

    await superAdmin.related('roles').attach([superAdminRole.id])
    await user.related('roles').attach([userRole.id])

  }
}
