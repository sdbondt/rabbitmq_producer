import cron from 'node-cron'
import cleanupExpiredSessions from './utils/cleanupExpiredSessions'

const setupBackgroundTasks = () => {
    cron.schedule('0 0 * * *', async () => {
        await cleanupExpiredSessions()
    })
}

export default setupBackgroundTasks