import 'dotenv/config'

const host = process.env.RABBIT_HOST
const port = process.env.RABBIT_PORT

const rabbitmqConf = {
    host,
    port
}

export default rabbitmqConf
