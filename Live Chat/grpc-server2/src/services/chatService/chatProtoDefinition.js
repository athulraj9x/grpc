const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const CHAT_SYSTEM_PROTO_PATH = path.join(__dirname + '../../../protos/chatSystem.proto');

const chatPackageDefinition = protoLoader.loadSync(CHAT_SYSTEM_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const ChatServiceDefinition = grpc.loadPackageDefinition(
  chatPackageDefinition,
).chat_system_proto;

module.exports = {
  ChatServiceDefinition,
  grpc: grpc,
};
