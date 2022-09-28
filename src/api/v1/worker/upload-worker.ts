import amqp from 'amqplib'
import { rabbitmqConf } from '@config'
import logger from '@api-v1/utils/logger'

interface UploadWorker {
  productId: any
  folder: string
  resize: {
    width: number
    height: number
  }
  name: 'product'
}

interface UploadSingleWorker extends UploadWorker {
  file: Express.Multer.File | undefined
}

interface UploadMultiWorker extends UploadWorker {
  files:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined
}

export const uploadSingleFileWorker = async (msg: UploadSingleWorker) => {
  try {
    const connection = await amqp.connect(
      `amqp://${rabbitmqConf.host}:${rabbitmqConf.port}`
    )
    const channel = await connection.createChannel()
    await channel.assertQueue('upload-single')
    await channel.sendToQueue('upload-single', Buffer.from(JSON.stringify(msg)))
    setTimeout(() => {
      connection.close()
    }, 1000)
  } catch (error: any) {
    logger.error({ error: error.message }, 'Error upload workder rabbitmq')
  }
}

export const uploadMultiFileWorker = async (msg: UploadMultiWorker) => {
  try {
    const connection = await amqp.connect(
      `amqp://${rabbitmqConf.host}:${rabbitmqConf.port}`
    )
    const channel = await connection.createChannel()
    await channel.assertQueue('upload-multi')
    await channel.sendToQueue('upload-multi', Buffer.from(JSON.stringify(msg)))
    setTimeout(() => {
      connection.close()
    }, 1000)
  } catch (error: any) {
    logger.error({ error: error.message }, 'Error upload workder rabbitmq')
  }
}
