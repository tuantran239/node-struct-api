import 'dotenv/config'

const cloudinaryName = process.env.CLOUDINARY_NAME
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET

type NameFolder = 'avatar'

const folder = (name: NameFolder, userId: any) => {
  switch (name) {
    case 'avatar':
      return `hackrio/${userId}/avatar`
    default:
      return 'blog/orther'
  }
}

const cloudinaryConf = {
  cloudinaryName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
  folder
}

export default cloudinaryConf
