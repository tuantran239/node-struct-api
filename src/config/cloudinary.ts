const cloudinaryName = process.env.CLOUDINARY_NAME
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET

type NameFolder = 'avatar' | 'post'

const folder = (name: NameFolder, userId: any) => {
  switch (name) {
    case 'avatar':
      return `blog/${userId}/avatar`
    case 'post':
      return `blog/${userId}/post`
    default:
      return 'blog/orther'
  }
}

const cloudinary = {
  cloudinaryName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
  folder
}

export default cloudinary
