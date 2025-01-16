const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// const PROTO_PATH = __dirname + '/protos/userDetails.proto';
const amqp = require('amqplib');

const {
  userData,
  userProfile,
  userOrders,
} = require('./services/userService/index');
const {
  ChatServiceDefinition,
} = require('./services/chatService/chatProtoDefinition');
const {
  SendMessage,
  GetChatHistory,
  LiveChat,
} = require('./services/chatService/chat.service');

const PROTO_PATH = __dirname + '/src/../protos/test.proto';
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// console.log("packageDefinition",packageDefinition)
// 
const protoQueue = grpc.loadPackageDefinition(packageDefinition).order;
// const userServices = grpc.loadPackageDefinition(packageDefinition).user_details_proto;


const RABBITMQ_URL = 'amqp://localhost';

// gRPC server implementation
async function createQueues(call, callback) {
  const queueCount = call.request.count || 10; // Default to 10 queues
  const queueNames = [];

  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Create queues
    for (let i = 1; i <= queueCount; i++) {
      const queueName = `test_queue_${i}`;
      await channel.assertQueue(queueName);
      queueNames.push(queueName);
    }

    // Close connection
    await channel.close();
    await connection.close();

    callback(null, { queues: queueNames });
  } catch (error) {
    console.error('Error creating queues:', error);
    callback(error, null);
  }
}
function processOrder(call, callback) {
  const orderId = call.request.order_id;

  // Randomly determine the outcome
  const outcome = Math.random();
  if (outcome < 0.7) {
    // 70% chance of success
    callback(null, {
      order_id: orderId,
      status: 'success',
      delay_seconds: 0,
      message: 'Order processed successfully.',
    });
  } else if (outcome < 0.9) {
    // 20% chance of delay
    const delaySeconds = Math.floor(Math.random() * 10) + 1; // Random delay between 1-10 seconds
    setTimeout(() => {
      callback(null, {
        order_id: orderId,
        status: 'delayed',
        delay_seconds: delaySeconds,
        message: `Order delayed by ${delaySeconds} seconds.`,
      });
    }, delaySeconds * 1000); // Simulate delay
  } else {
    // 10% chance of rejection
    callback(null, {
      order_id: orderId,
      status: 'rejected',
      delay_seconds: 0,
      message: 'Order rejected due to insufficient stock.',
    });
  }
}

console.log('================================================ ');
// console.log('ServiceName', userServices.UserRPCService.serviceName);
// console.log('ServiceName', ChatServiceDefinition.ChatService.serviceName);
console.log('================================================ ');

const PORT = '0.0.0.0:50052';
const server = new grpc.Server();

// server.addService(userServices.UserRPCService.service, {
//   userData,
//   userProfile,
//   userOrders,
// });

// server.addService(ChatServiceDefinition.ChatService.service, {
//   SendMessage,
//   GetChatHistory,
//   LiveChat,
// });

// console.log("proto.QueueService.service,",protoQueue)
server.addService(protoQueue.OrderService.service, { ProcessOrder: processOrder });
server.bindAsync(
  PORT,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error('Failed to start server:', error.message);
      return;
    }
    console.log(`Server 2 running on port ${port}`);
  },
);
