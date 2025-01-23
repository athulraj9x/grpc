const { GRPC_Global } = require("./config/grpc.config");
const { chatProto , QueueProto, TestProto} = require("./services/chat.service");

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

// console.log("QueueProto",QueueProto.OrderService);

// const client = new QueueProto.QueueService('localhost:50052', GRPC_Global.credentials.createInsecure());
// const client = new QueueProto.OrderService('localhost:50052', GRPC_Global.credentials.createInsecure());
const clientTest = new TestProto.TestService('localhost:50052', GRPC_Global.credentials.createInsecure());
// client.CreateQueues({ count: 10 }, (err, response) => {
//   if (err) {
//     console.error('Error:', err);
//   } else {
//     console.log('Queues created:', response.queues);
//   }
// });

// async function createQueues(call, callback) {
//   const queueCount = call.request.count || 10; // Default to 10 queues
//   const queueNames = [];

//   try {
//     // Connect to RabbitMQ
//     const connection = await amqp.connect(RABBITMQ_URL);
//     const channel = await connection.createChannel();

//     // Create queues
//     for (let i = 1; i <= queueCount; i++) {
//       const queueName = `test_queue_${i}`;
//       await channel.assertQueue(queueName);
//       queueNames.push(queueName);
//     }

//     // Close connection
//     await channel.close();
//     await connection.close();

//     callback(null, { queues: queueNames });
//   } catch (error) {
//     console.error('Error creating queues:', error);
//     callback(error, null);
//   }
// }

function simulateOrder(orderId) {
  console.log(orderId);
  const order = {
    orderId: orderId,
    order_Ids:`${orderId}-${orderId}`
  }
  client.PlaceOrder(order, (err, response) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log("response:", response);
    console.log(`Order ID: ${response.orderId}`);
    console.log(`Status: ${response.status}`);
    if (response.status === 'delayed') {
      console.log(`Delay: ${response.delaySeconds} seconds`);
    }
    console.log(`Message: ${response.message}`);
    console.log('---');
  });
}

function sayHello () {
  clientTest.SayHello("hello",(err, response) => {
    if(err){
      console.log('err-----',err)
    }else{
      console.log('response: ', response)
    }
  });
}

function getHistory (order_id) {
  const data = {
    orderId:order_id
  }
  client.GetOrderHistory(data, (err,res) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    const response = (res)
    if(response?.status){
      console.log("rsponse status: ", response.status);
      console.log(response.orders)
    }
  })
}

// Test with multiple orders
for (let i = 1; i <= 10; i++) {
  sayHello()
  // simulateOrder(`order_${i}`);
  // getHistory(`order_${i}`);
  
}


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
