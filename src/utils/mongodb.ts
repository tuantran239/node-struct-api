import { connect, ConnectOptions } from 'mongoose'
import db from '../config/db'
import logger from './logger'

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

connect(db.mongodbUrl as string, options as ConnectOptions)
  .then(() => {
    logger.info('Connected with mongodb')
  })
  .catch((err) => {
    logger.error({ error: err.message }, 'Error connecting to MongoDB')
  })
