import express, { Request, Response } from 'express'
import logger from './utils/logger'
import routes from './routes'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import deserializeUser from './middlewares/deserializeUser'
import path from 'path'
import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'
import cloudinary from './config/cloudinary'
import * as cloudinaryNpm from 'cloudinary'

import './utils/mongodb'

const swaggerDoc = YAML.load('./src/doc.yaml')

const PORT = process.env.PORT || 5000

cloudinaryNpm.v2.config({
  cloud_name: cloudinary.cloudinaryName,
  api_key: cloudinary.cloudinaryApiKey,
  api_secret: cloudinary.cloudinaryApiSecret
})

const app = express()
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())
app.use(deserializeUser)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/v1/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.use(routes)

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`)
})
