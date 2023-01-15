import Router from '@koa/router'
import * as monumentController from './monument-controller.js'
const monuments = new Router()

monuments.get('/', monumentController.getAll)
monuments.get('/:monumentId', monumentController.getMonumentById)

export default monuments