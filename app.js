import '#config/database.js'
import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import respond from 'koa-respond'

const app = new Koa()

app
  .use(cors('*'))
  .use(bodyParser())
  .use(respond())

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
