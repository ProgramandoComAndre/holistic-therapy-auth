const amqp = require('amqplib');

const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
const queue = 'therapist_events';

async function sendMessage(message) {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, {
            durable: true
        });

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true
        });

        console.log(`Sent message to ${queue}:`, message);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error in RabbitMQ producer:', error);
    }
}

module.exports = sendMessage;
