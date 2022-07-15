import { v4 as uuidv4 } from 'uuid'
import cloudinary from 'cloudinary'

export const uploadToCloudinary = (
  image: any,
  folder: string
): Promise<cloudinary.UploadApiResponse | undefined> => {
  return new Promise(function (resolve, reject) {
    cloudinary.v2.uploader.upload(
      image,
      { public_id: `${Date.now()}-${uuidv4()}`, folder },
      async function (error, result) {
        if (error) {
          throw error
        }
        return resolve(result)
      }
    )
  })
}

export const destroyCloudinary = (publicId: string): Promise<boolean> => {
  return new Promise(function (resolve, reject) {
    cloudinary.v2.uploader.destroy(
      publicId,
      function (error: any, result: any) {
        if (error) {
          throw error
        }
        return resolve(true)
      }
    )
  })
}
