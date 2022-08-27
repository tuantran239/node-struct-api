import { Request, Response, NextFunction } from 'express'
import amqp from 'amqplib'
import logger from '../utils/logger'
import { rabbitmqConf } from '../../../config'
import { sendLinkVerify } from '../services/auth.service'

const consumer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await amqp.connect(`amqp://${rabbitmqConf.host}:${rabbitmqConf.port}`)
    const channel = await connection.createChannel()
    await channel.assertQueue('email')
    channel.consume('email', async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString())
        await await sendLinkVerify(data.email, data.method, data.token, data.link)
        channel.ack(msg)
      }
    })
  } catch (error: any) {
    logger.error({ error: error.message }, 'Error consumer rabbitmq')
  }
  next()
}

export default consumer
