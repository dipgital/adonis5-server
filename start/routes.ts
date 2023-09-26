/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

/**
 * Route group for the API
 * prefix: /api/v1
 * middleware: auth
 * permissions: .middleware('permissions:can-see-api')
*/

Route.group(() => {

  Route.post('/login', 'AuthController.login')

  Route.group(() => {

    Route.post('/logout', 'AuthController.logout')

    // Users
    Route.get('/users', 'UsersController.index').middleware('permission:can-see-user')
    Route.post('/users', 'UsersController.store').middleware('permission:can-create-user')
    Route.get('/users/:id', 'UsersController.show').middleware('permission:can-see-user')
    Route.patch('/users/:id', 'UsersController.update').middleware('permission:can-edit-user')
    Route.delete('/users/:id', 'UsersController.destroy').middleware('permission:can-delete-user')

    // Roles
    Route.get('/roles', 'RolesController.index').middleware('permission:can-see-role')
    Route.post('/roles', 'RolesController.store').middleware('permission:can-create-role')
    Route.get('/roles/:id', 'RolesController.show').middleware('permission:can-see-role')
    Route.patch('/roles/:id', 'RolesController.update').middleware('permission:can-edit-role')
    Route.delete('/roles/:id', 'RolesController.destroy').middleware('permission:can-delete-role')
    Route.post('/roles/:id/permissions', 'RolesController.assignPermissions').middleware('permission:can-create-role')
    Route.delete('/roles/:id/permissions', 'RolesController.removePermissions').middleware('permission:can-delete-role')

    // Permissions
    Route.get('/permissions', 'PermissionsController.index').middleware('permission:can-see-permission')
    Route.post('/permissions', 'PermissionsController.store').middleware('permission:can-create-permission')
    Route.get('/permissions/:id', 'PermissionsController.show').middleware('permission:can-see-permission')
    Route.patch('/permissions/:id', 'PermissionsController.update').middleware('permission:can-edit-permission')
    Route.delete('/permissions/:id', 'PermissionsController.destroy').middleware('permission:can-delete-permission')

  }).middleware('auth:jwt')

}).prefix('/api/v1')
