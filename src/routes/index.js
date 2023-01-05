import Router from '@koa/router'
import authenticationRoutes from '#components/user/authentication-routes.js'
import monumentRoutes from '#components/monument/monument-routes.js'
import quizRoutes from '#components/quiz/quiz-routes.js'
import questionRoutes from '#components/question/question-routes.js'

const API_V1_ROUTER_UNPROTECTED = new Router({ prefix: '/api/v1' })
const API_V1_ROUTER_PROTECTED = new Router({ prefix: '/api/v1' })

API_V1_ROUTER_UNPROTECTED.use('/users', authenticationRoutes.routes(), authenticationRoutes.allowedMethods())
API_V1_ROUTER_PROTECTED.use('/monuments', monumentRoutes.routes(), monumentRoutes.allowedMethods())
API_V1_ROUTER_PROTECTED.use('/quizzes', quizRoutes.routes(), quizRoutes.allowedMethods())
API_V1_ROUTER_PROTECTED.use('/questions', questionRoutes.routes(), questionRoutes.allowedMethods())

export { API_V1_ROUTER_UNPROTECTED, API_V1_ROUTER_PROTECTED }