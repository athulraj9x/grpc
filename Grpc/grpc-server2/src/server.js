const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/protos/userDetails.proto';

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

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userServices = grpc.loadPackageDefinition(packageDefinition).user_details_proto;

console.log('================================================ ');
console.log('ServiceName', userServices.UserRPCService.serviceName);
console.log('ServiceName', ChatServiceDefinition.ChatService.serviceName);
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
