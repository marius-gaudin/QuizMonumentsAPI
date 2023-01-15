import Router from '@koa/router'
import * as userController from '#components/user/user-controller.js'
const users = new Router()

users.post('/register', userController.register)
users.post('/login', userController.login)

export default users