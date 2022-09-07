import 'dotenv/config'

const cloudinaryName = process.env.CLOUDINARY_NAME
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET


const cloudinaryConf = {
  cloudinaryName,
  cloudinaryApiKey,
  cloudinaryApiSecret
}

export default cloudinaryConf
