const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const USER_REQUEST_PROTO_PATH = __dirname + '/../protos/userRequest.proto';
const CHAT_SYSTEM_PROTO_PATH = __dirname + '/../protos/chatSystem.proto';
// Load the proto file
const userPackageDefinition = protoLoader.loadSync(USER_REQUEST_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const chatPackageDefinition = protoLoader.loadSync(CHAT_SYSTEM_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

console.log('packageDefinitions: ',chatPackageDefinition )
const userDetailsServices = grpc.loadPackageDefinition(userPackageDefinition).user_details_proto;
const ChatDetailsServices = grpc.loadPackageDefinition(chatPackageDefinition).chat_system_proto;
const userClient = new userDetailsServices.UserRPCService('localhost:50052', grpc.credentials.createInsecure());
const chatClient = new ChatDetailsServices.ChatService('localhost:50052', grpc.credentials.createInsecure());

module.exports = {
  userClient,
  chatClientService:chatClient,
};
