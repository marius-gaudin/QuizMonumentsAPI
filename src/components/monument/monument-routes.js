import Router from '@koa/router'
import * as monumentController from '#components/monument/monument-controller.js'
const monuments = new Router()

monuments.get('/', monumentController.getAll)

export default monuments