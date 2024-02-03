import { userSessionRepository } from '../data-source'

const cleanupExpiredSessions = async () => {
    const now = new Date()
    await userSessionRepository
        .createQueryBuilder()
        .delete()
        .where("expiresAt < :now", { now })
        .execute()
}

export default cleanupExpiredSessions