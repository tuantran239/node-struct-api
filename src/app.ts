import express from 'express'
import routes from './routes'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import deserializeUser from './middlewares/deserializeUser'
import path from 'path'
import cloudinaryConf from './config/cloudinary'
import cloudinary from 'cloudinary'
import server from './config/server'
import session from 'express-session'
import passport from 'passport'
import setSwaggerDoc from './middlewares/swaggerDoc'
import consumer from './worker/consumer'

import './utils/passport'

cloudinary.v2.config({
  cloud_name: cloudinaryConf.cloudinaryName,
  api_key: cloudinaryConf.cloudinaryApiKey,
  api_secret: cloudinaryConf.cloudinaryApiSecret
})

const app = express()
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: server.domain,
    credentials: true
  })
)
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    saveUninitialized: true,
    resave: true
  })
)
app.use(deserializeUser)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(setSwaggerDoc)

app.use(passport.initialize())
app.use(passport.session())

app.use(consumer)
app.use(routes)

export default app
