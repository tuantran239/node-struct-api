import app from './app'
import logger from './utils/logger'

import './utils/mongodb'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`)
})
