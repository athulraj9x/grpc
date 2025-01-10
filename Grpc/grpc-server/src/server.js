const grpc = require('@grpc/grpc-js');
const client = require('../clients/greeter.client');
const protoLoader = require('@grpc/proto-loader');
const { callService } = require('../src/services/greeter.service');

const PORT = '0.0.0.0:50051';
const server = new grpc.Server();

// const mockCall = {
//   request: {
//     method: 'userData',
//     method: 'UserProfile',
//     method: 'UserOrders',
//   },
// };

// client[mockCall.request.method](mockCall, (error, response) => {
//   if (error) {
//     console.error(`Error calling ${method}:`, error.message);
//     throw new Error(`Error calling ${method}`)
//   }
//   console.log('Result:::::::::',response)
// });

// const mockCalls = [
//   { method: 'UserData', params: {} },
//   { method: 'UserProfile', params: {} },
//   { method: 'UserOrders', params: {} },
// ];

// Function to make a single gRPC call
// const makeGrpcCall = (method, params) => {
//   return new Promise((resolve, reject) => {
//     client[method](params, (error, response) => {
//       if (error) {
//         return reject(`Error calling ${method}: ${error.message}`);
//       }
//       resolve(response);
//     });
//   });
// };

// Making all the gRPC calls concurrently
// async function callMultipleServices() {
//   try {
//     const promises = mockCalls.map(call =>
//       makeGrpcCall(call.method, call.params)
//     );

//     const results = await Promise.all(promises);
//     console.log(results)

//   } catch (error) {
//     console.error(error);
//   }
// }
// callMultipleServices()

// Test ChatService (example of a chat streaming call)
const call = client.chatClientService.SendMessage(
  { user: 'TestUser', message: 'Hello test from server1!' },
  (error, response) => {
    if (error) {
      console.error('Error in SendMessage:::::::::', error.message);
    } else {
      console.log('SendMessage response:', response);
    }
  },
);

server.bindAsync(
  PORT,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error('Failed to start server:', error.message);
      return;
    }
    console.log(`gRPC server running on port ${port}`);
  },
);