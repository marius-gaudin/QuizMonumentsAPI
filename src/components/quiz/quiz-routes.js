import Router from '@koa/router'
import * as quizController from '#components/quiz/quiz-controller.js'
const quizzes = new Router()

quizzes.post('/create', quizController.create)

export default quizzes