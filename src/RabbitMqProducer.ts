import amqp from 'amqplib'
import CustomError from './handlers/customError'
import { RABBITMQ_CONNECTION_ERROR } from './constants/errorMessages'
import { SERVICE_UNAVAILABLE } from './constants/statusCodes'

const url = process.env.QUEUE_URL

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        return channel;
    } catch (e) {
        throw new CustomError(RABBITMQ_CONNECTION_ERROR, SERVICE_UNAVAILABLE)
    }
}

export const sendMessage = async (queue: string, message) => {
    const channel = await connectToRabbitMQ();
    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
}