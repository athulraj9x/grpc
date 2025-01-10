// // grpc-server-1/config/grpc.config.js

// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const PROTO_PATH = __dirname + '/../proto/helloworld.proto';

// // Load the protobuf definition
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true
// });

// const hello_proto = grpc.loadPackageDefinition(packageDefinition).hello_proto;

// // Export the GreeterService and grpc
// module.exports = {
//   GreeterService: hello_proto.Greeter,
//   grpc: grpc
// };
