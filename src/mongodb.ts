import { connect, ConnectOptions } from 'mongoose'
import { dbConf } from './config'
import { logger } from '@api/utils'

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

connect(dbConf.mongodbUrl as string, options as ConnectOptions)
  .then(() => {
    logger.info('Connected with mongodb')
  })
  .catch((err) => {
    logger.error({ error: err.message }, 'Error connecting to MongoDB')
  })
