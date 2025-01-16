const { GRPC_Global } = require("./config/grpc.config");
const { chatProto , QueueProto} = require("./services/chat.service");

const PORT = "0.0.0.0:50051";
const server = new GRPC_Global.Server();

const activeClients = [];

server.addService(chatProto.ChatService.service, {
  ChatRPC: (call) => {
    console.log("User connected");
    activeClients.push(call);

    // Handle incoming messages
    call.on("data", (message) => {
      console.log("call received",new Date())
      console.log(`New message from ${message.sender}: ${message.content}`);

      // Prompt the server to send a reply
      const stdin = process.openStdin();
      console.log('Type your reply and press Enter:');
      stdin.addListener('data', (data) => {
        const replyMessage = {
          sender: 'Server 1',
          content: data.toString().trim(),
        };
        // Send the server's reply to the client
        call.write(replyMessage);
      });
    });

    // Handle client disconnection
    call.on("end", () => {
      console.log("User disconnected");
      const index = activeClients.indexOf(call);
      if (index !== -1) activeClients.splice(index, 1);
      call.end();
    });

    // Handle stream errors
    call.on("error", (err) => {
      console.error("Error in ChatRPC:", err.message);
    });
  },
});

const client = new QueueProto.QueueService('localhost:50052', GRPC_Global.credentials.createInsecure());
client.CreateQueues({ count: 10 }, (err, response) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Queues created:', response.queues);
  }
});



server.bindAsync(
  PORT,
  GRPC_Global.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Failed to start server:", error.message);
      return;
    }
    console.log(`gRPC server running on port ${port}`);
  }
);
