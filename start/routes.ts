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
    Route.get('/users', 'UsersController.index').middleware('role:superadmin')
    Route.post('/users', 'UsersController.store').middleware('permission:can-create-user')
    Route.get('/users/:id', 'UsersController.show').middleware('permission:can-see-user')
    Route.patch('/users/:id', 'UsersController.update').middleware('permission:can-edit-user')
    Route.delete('/users/:id', 'UsersController.destroy').middleware('permission:can-delete-user')

    // Roles
  }).middleware('auth:jwt')

}).prefix('/api/v1')
