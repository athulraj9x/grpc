const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname + '/../../../protos/sentToServer.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });


const serverToServerProto = grpc.loadPackageDefinition(packageDefinition).server_to_server;

module.exports = {
  serverToServerProto,
  grpc: grpc,
};
