import Router from '@koa/router'
import * as questionController from '#components/question/question-controller.js'
const questions = new Router()

questions.post('/start/:id', questionController.start)

export default questions