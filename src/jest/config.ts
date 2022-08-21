const configVariableEnv = () => {
    process.env.PORT = '5000'
    process.env.DOMAIN = 'http://localhost:5000'
    process.env.VERSION = 'v1'
    process.env.JWT_SECRET = 'secret!@#$%^&*'
    process.env.EMAIL_USER = 'test@gmail.com'
    process.env.EMAIL_PASSWORD = 'test'
    process.env.REDIS_PORT = '6379'
    process.env.REDIS_HOST = 'redis'
    process.env.SESSION_SECRET = 'secret!@#$%^^&*'
}

export default configVariableEnv
