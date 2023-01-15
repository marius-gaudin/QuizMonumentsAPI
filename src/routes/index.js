import Router from '@koa/router'
import userRoutes from '#components/user/user-routes.js'
import monumentRoutes from '#components/monument/monument-routes.js'
import quizRoutes from '#components/quiz/quiz-routes.js'

const API_V1_ROUTER_UNPROTECTED = new Router({ prefix: '/api/v1' })
const API_V1_ROUTER_PROTECTED = new Router({ prefix: '/api/v1' })

API_V1_ROUTER_UNPROTECTED.use('/users', userRoutes.routes(), userRoutes.allowedMethods())
API_V1_ROUTER_PROTECTED.use('/monuments', monumentRoutes.routes(), monumentRoutes.allowedMethods())
API_V1_ROUTER_PROTECTED.use('/quizzes', quizRoutes.routes(), quizRoutes.allowedMethods())

export { API_V1_ROUTER_UNPROTECTED, API_V1_ROUTER_PROTECTED }