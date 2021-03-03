const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// this line allows express to automatically turn incoming json into objects
app.use(express.json())
// these lines allows express to use routes from other files
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log('server is up on: ' + port)
})

