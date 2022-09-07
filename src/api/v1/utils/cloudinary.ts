import { v4 as uuidv4 } from 'uuid'
import cloudinary from 'cloudinary'

type UploadResult = {
  public_id: string
  url: string
}

export const uploadToCloudinary = (
  image: any,
  folder: string
): Promise<UploadResult | undefined> => {
  return new Promise(function (resolve, reject) {
    cloudinary.v2.uploader.upload(
      image,
      { public_id: `${Date.now()}-${uuidv4()}`, folder },
      async function (error, res) {
        if (error) {
          throw error
        }
        if (!res) {
          return undefined
        } else {
          const result: UploadResult = { public_id: res.public_id, url: res.url }
          return resolve(result)
        }
      }
    )
  })
}

export const destroyCloudinary = (publicId: string): Promise<boolean> => {
  return new Promise(function (resolve, reject) {
    cloudinary.v2.uploader.destroy(publicId, function (error: any, result: any) {
      if (error) {
        throw error
      }
      return resolve(true)
    })
  })
}
