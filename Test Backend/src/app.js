import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/errorHandler.js'


const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : "1000kb"}))
app.use(express.urlencoded({extended : true , limit : "1000kb"}))
app.use(cookieParser())




//route import
import userRouter from './routes/user.routes.js'
import questionRouter from './routes/question.routes.js'
import testRouter from './routes/test.routes.js'
import responseRouter from './routes/response.routes.js'
import resultRouter from './routes/result.routes.js'
import adminRouter from './routes/admin.routes.js'
import bookmarkRouter from "./routes/bookmark.routes.js"

// routes declaration

app.use("/api/v1/users" , userRouter)
 // middleware to give acess of route to whom
app.use("/api/v1/question" , questionRouter)
app.use("/api/v1/test" , testRouter)
app.use("/api/v1/response" , responseRouter)
app.use('/api/v1/result' , resultRouter)
app.use('/api/v1/admins' , adminRouter)
app.use('/api/v1/bookmark' , bookmarkRouter)

app.use(errorHandler);

export {app}










//whenever we use middleware or we have to do config setting
















