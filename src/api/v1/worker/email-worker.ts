import amqp from 'amqplib'
import { rabbitmqConf } from '@config'
import logger from '../utils/logger'

type SendMailWorker = {
  email: string
  method: string
  token: string
  link: string
}

export const sendMailWorker = async (msg: SendMailWorker) => {
  try {
    const connection = await amqp.connect(`amqp://${rabbitmqConf.host}:${rabbitmqConf.port}`)
    const channel = await connection.createChannel()
    await channel.assertQueue('email')
    await channel.sendToQueue('email', Buffer.from(JSON.stringify(msg)))
    setTimeout(() => {
      connection.close()
    }, 1000)
  } catch (error: any) {
    logger.error({ error: error.message }, 'Error email workder rabbitmq')
  }
}
