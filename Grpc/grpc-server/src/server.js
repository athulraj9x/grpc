const grpc = require("@grpc/grpc-js");
const client = require("../clients/greeter.client");
const protoLoader = require("@grpc/proto-loader");
const { callService } = require("../src/services/greeter.service");
const {
  serverService,
  serverToServerProto,
} = require("./services/sentToServer");

const PORT = "0.0.0.0:50051";
const server = new grpc.Server({
  interceptors: [loggingInterceptor],
});

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

// client.chatClientService.SendMessage(
//   { user: "TestUser", message: "Hello test from server1!" },
//   (error, response) => {
//     if (error) {
//       console.error("Error in SendMessage:::::::::", error.message);
//     } else {
//       console.log("SendMessage response:", response);
//     }
//   }
// );

// client.chatClientService.GetChatHistory(
//   { userId: "TestUser", message: "Hello test from server1!" },
//   (error, response) => {
//     if (error) {
//       console.error("Error in SendMessage:::::::::", error.message);
//     } else {
//       console.log("SendMessage response:", response);
//     }
//   }
// );
// const messages = [
//   { sender: 'Server 2', content: 'Hello from Server 2' },
//   { sender: 'Server 2', content: 'This is another message from Server 2' }
// ];

// console.log("client.chatClientOnly.ChatService",client.chatClientOnly)

// server.addService(client.chatClientOnly.ChatService.service, {
//   StreamMessages: (call) => {
//     let i = 0;
//     const interval = setInterval(() => {
//       if (i < messages.length) {
//         call.write(messages[i]);
//         i++;
//       } else {
//         clearInterval(interval);
//         call.end();
//       }
//     }, 5000);
//   }
// });

  // Logging Interceptor
function loggingInterceptor(call, methodDescriptor, next) {
  console.log(`Received call to ${methodDescriptor.path}`);
  const startTime = Date.now();

  const callback = (err, res) => {
    const duration = Date.now() - startTime;
    console.log(`Method ${methodDescriptor.path} took ${duration}ms`);
    next(err, res);
  };

  next(call, callback);
}



const requestData = {
  data: ["Item 1", "Item 2", "Item 3"],
};

// Call SendDataToServerRPC
serverService.SendDataToServer(requestData, (error, response) => {
  if (error) {
    console.error("Error calling SendDataToServerRPC:", error.message);
  } else {
    console.log("Response from SendDataToServerRPC:", response.message);
  }
});

// Call SendDataUserData
serverService.SendDataUserData(requestData, (error, response) => {
  if (error) {
    console.error("Error calling SendDataUserData:", error.message);
  } else {
    console.log("Response from SendDataUserData:", response.message);
  }
});

// Call SendDataUserProfile
serverService.SendDataUserProfile(requestData, (error, response) => {
  if (error) {
    console.error("Error calling SendDataUserProfile:", error.message);
  } else {
    console.log("Response from SendDataUserProfile:", response.message);
  }
});
console.log("running server");

// SERVER LISTENING SERVER 1
server.bindAsync(
  PORT,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Failed to start server:", error.message);
      return;
    }
    console.log(`gRPC server running on port ${port}`);
  }
);
