const grpc = require('@grpc/grpc-js');
const { serverToServerProto } = require('./services/serverToServer/server.service');
const dataService = require('./services/serverToServer/dataService');



const server = new grpc.Server();
const PORT = '0.0.0.0:50053';

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
