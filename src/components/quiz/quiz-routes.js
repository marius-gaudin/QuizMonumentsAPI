import Router from '@koa/router'
import * as quizController from '#components/quiz/quiz-controller.js'
const quizzes = new Router()

quizzes.get('/', quizController.getAll)
quizzes.get('/:quizId', quizController.getById)
quizzes.post('/new', quizController.newQuiz)
quizzes.get('/:quizId/question/:questionId', quizController.getQuestion)
quizzes.put('/:quizId/question/:questionId', quizController.setQuestionAnswer)
quizzes.delete('/:quizId', quizController.deleteById)

export default quizzes