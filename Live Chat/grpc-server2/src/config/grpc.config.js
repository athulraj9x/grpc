// // src/config/grpc.config.js

// const path = require('path');
// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');

// // Path to the .proto file
// const PROTO_PATH = path.join(__dirname, '../protos/userDetails.proto');

// // Load the .proto file
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });

// // Load the gRPC package definition
// const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).user_details_proto;

// // Export the Greeter service
// const GreeterService = protoDescriptor.helloworld.Greeter;

// module.exports = {
//   GreeterService,
//   grpc,
// };
