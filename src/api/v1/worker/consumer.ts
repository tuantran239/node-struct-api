import { Request, Response, NextFunction } from 'express'
import amqp from 'amqplib'
import logger from '@api/utils/logger'
import { rabbitmqConf } from '@config'
import { sendLinkVerify } from '@api/services/auth.service'
import { uploadFile, uploadMultiFile } from '@api/services/upload.service'
import { updateProduct } from '@api/services/product.service'

const consumer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await amqp.connect(
      `amqp://${rabbitmqConf.host}:${rabbitmqConf.port}`
    )
    const channel = await connection.createChannel()
    await channel.assertQueue('email')
    await channel.assertQueue('upload-multi')
    await channel.assertQueue('upload-single')
    channel.consume('email', async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString())
        await sendLinkVerify(data.email, data.method, data.token, data.link)
        channel.ack(msg)
      }
    })
    channel.consume('upload-single', async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString())
        if (data.file) {
          data.file.buffer = Buffer.from(data.file.buffer.data)
        }
        const { data: image } = await uploadFile(
          data.folder,
          data.file,
          data.resize
        )
        channel.ack(msg)
      }
    })
    channel.consume('upload-multi', async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString())
        let files: any[] = []
        if (data.files && data.files instanceof Array) {
          files = data.files.map((file: any) => {
            file.buffer = Buffer.from(file.buffer.data)
            return file
          })
        }
        const { data: images } = await uploadMultiFile(
          data.folder,
          files,
          data.resize
        )
        if (images && images.length > 0) {
          if (data.name === 'product') {
            await updateProduct(
              { _id: data.productId },
              { images, mainImage: images[0] }
            )
          }
        }
        channel.ack(msg)
      }
    })
  } catch (error: any) {
    logger.error({ error: error.message }, 'Error consumer rabbitmq')
  }
  next()
}

export default consumer
