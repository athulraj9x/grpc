const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const SERVER_REQUEST_PROTO_PATH = __dirname + '/../proto/sentToServer.proto';
// Load the proto file
const userPackageDefinition = protoLoader.loadSync(SERVER_REQUEST_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const serverToServer_services = grpc.loadPackageDefinition(userPackageDefinition).server_to_server;
const serverToServer = new serverToServer_services.DataServiceToAnother('localhost:50053', grpc.credentials.createInsecure());

module.exports = {
  serverService:serverToServer,
};