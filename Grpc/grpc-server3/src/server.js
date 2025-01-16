const grpc = require('@grpc/grpc-js');
const { serverToServerProto } = require('./services/serverToServer/server.service');
const dataService = require('./services/serverToServer/dataService');
const amqp = require('amqplib');




const server = new grpc.Server();
const PORT = '0.0.0.0:50053';

const protoLoader = require('@grpc/proto-loader');
const amqp = require('amqplib');

// Load gRPC definition
const PROTO_PATH = '../protos/test.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).QueueService;


console.log("PROTO_PATH",PROTO_PATH)

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


function loggingInterceptor(call, callback, next) {
  console.log('Intercepting request...');
  console.log('Metadata:', call.metadata.getMap()); // Log metadata
  console.log('Request:', call.request); // Log request data

  // Call the actual method implementation
  const wrappedCallback = (err, response) => {
    if (err) {
      console.error('Error in method:', err.message);
    } else {
      console.log('Response:', response);
    }
    callback(err, response); // Continue with the response
  };

  next(call, wrappedCallback);
}

const wrappedDataService = {};
Object.keys(dataService).forEach((methodName) => {
  wrappedDataService[methodName] = (call, callback) => {
    loggingInterceptor(call, callback, dataService[methodName]);
  };
});


// console.log("ServerToServerServiceDefinition",serverToServerProto)
server.addService(serverToServerProto.DataServiceToAnother.service,wrappedDataService)
server.addService(proto.QueueService.service, { CreateQueues: createQueues });

// SERVER LISTENING SERVER 2
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
