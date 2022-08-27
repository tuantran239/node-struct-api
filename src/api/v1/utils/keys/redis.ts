export const authKey = (userId: string) => `auth#${userId}`

const redisKeys = {
    authKey
}

export default redisKeys
