import { throwValidationError } from '@api/error/mongodb-error'
import { uploadToCloudinary } from '@api/utils'
import { FuncHandleService } from '@api/utils/functions'
import sharp from 'sharp'

type Resize = {
  width: number
  height: number
}

export const uploadFile = (
  folder: string,
  file: Express.Multer.File | undefined,
  { width, height }: Resize
) =>
  FuncHandleService('Error upload file', async () => {
    if (!file) {
      throwValidationError('file', 'file not found', true)
    }
    const resizeFileBuffer = await sharp(file!!.buffer).resize(width, height).toBuffer()
    const encoded = 'data:image/png;base64,' + resizeFileBuffer.toString('base64')
    const result = await uploadToCloudinary(encoded, folder)
    return result
  })

export const uploadMultiFile = (
  folder: string,
  files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined,
  resize: Resize
) =>
  FuncHandleService('Error upload file', async () => {
    if (!files) {
      throwValidationError('file', 'file not found', true)
    }
    const result = await Promise.all(
      (files as Express.Multer.File[])!!.map((file) => uploadFile(folder, file, resize))
    )
    const data = result.map((res) => res.data)
    return data[0] ? data : undefined
  })
