import 'dotenv/config'

const accessKeyId = process.env.AWS_ACCESS_KEY_ID

const secretAccessKey = process.env.AWS_ACCESS_SECRET_KEY

const region = process.env.AWS_REGION

const awsConf = {
  accessKeyId,
  secretAccessKey,
  region
}

export default awsConf
