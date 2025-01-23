// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// // const PROTO_PATH = __dirname + '/protos/userDetails.proto';
// const amqp = require('amqplib');
// const {
//   userData,
//   userProfile,
//   userOrders,
// } = require('./services/userService/index');
// const {
//   ChatServiceDefinition,
// } = require('./services/chatService/chatProtoDefinition');
// const {
//   SendMessage,
//   GetChatHistory,
//   LiveChat,
// } = require('./services/chatService/chat.service');
// const db = require('./db/dbConnection');
// const { saveOrderToDatabase } = require('./db_action_helper/saveOrderDetails');
// // const { createSchema } = require("./db/schema"); 
// const PROTO_PATH = __dirname + '/src/../protos/rabbit.proto';
// // const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});

// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });

// // console.log("packageDefinition",packageDefinition)
// // 
// const protoQueue = grpc.loadPackageDefinition(packageDefinition).order;
// // const userServices = grpc.loadPackageDefinition(packageDefinition).user_details_proto;

// const RABBITMQ_URL = 'amqp://localhost';

// // gRPC server implementation
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

// async function processOrder(call, callback) {
//   console.log(new Date());
//   console.log('Incoming call request:', call.request);
//   const {order_id,user_id,product_id,quantity} = call.request;

//   // Randomly determine the outcome
//   const outcome = Math.random();
//   let status, delaySeconds = 0, message;

//   if (outcome < 0.7) {
//     // 70% chance of success
//     status = 'success';
//     message = 'Order processed successfully.';
//   } else if (outcome < 0.9) {
//     // 20% chance of delay
//     delaySeconds = Math.floor(Math.random() * 10) + 1; // Random delay between 1-10 seconds
//     status = 'delayed';
//     message = `Order delayed by ${delaySeconds} seconds.`;

//     // Simulate delay
//     await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
//   } else {
//     // 10% chance of rejection
//     status = 'rejected';
//     message = 'Order rejected due to insufficient stock.';
//   }

//   // Save to MySQL
//   try {
//     const orderDetails = {
//       order_id: order_id,
//       user_id: user_id,
//       status: status,
//       product_id,
//       delaySeconds:delaySeconds,
//       message: 'Order is being processed',
//       customerId: 123, 
//       addressId: 45,
//       quantity,
//     };
//     console.log(orderDetails)
    
    
//     saveOrderToDatabase(orderDetails, (error, result) => {
//       if (error) {
//         console.error('Error:', error.message);
//       } else {
//         console.log('Success:', result.message);
//       }
//     });
//     console.log('Order saved to database:', order_id);
//   } catch (error) {
//     console.error('Failed to save order to database:', error);
//     callback(error, null);
//     return;
//   }

//   // Return response
//   callback(null, {
//     orderId: order_id,
//     status,
//     delay_seconds: delaySeconds.toString(),
//     message,
//   });
// }


// console.log('================================================ ');
// // console.log('ServiceName', userServices.UserRPCService.serviceName);
// // console.log('ServiceName', ChatServiceDefinition.ChatService.serviceName);
// console.log('================================================ ');

// const PORT = '0.0.0.0:50052';
// const server = new grpc.Server();

// // server.addService(userServices.UserRPCService.service, {
// //   userData,
// //   userProfile,
// //   userOrders,
// // });

// // server.addService(ChatServiceDefinition.ChatService.service, {
// //   SendMessage,
// //   GetChatHistory,
// //   LiveChat,
// // });

// async function getHistory(call, callback) {
//   try {
//     const orderId = call.request.order_id; // Retrieve order ID from gRPC request

//     console.log("call.request",call.request)
//     console.log("Order ID:", orderId || "Fetching all orders");

//     // Query to fetch orders, filtered by `orderId` if provided
//     const query = `
//     SELECT * FROM orders
//   `;
//   // const results = []
//   // const [results] = await db.query(query, [orderId]);
//   const [results] = await db.query(query);
//   console.log(results);
  

//     console.log("Order history retrieved successfully:", results);

//     // Return results via the gRPC callback
//     // const response = { status: true, orders: results }
//     callback(null, { status: true, orders: results });
//   } catch (error) {
//     console.error("Unexpected error:", error.message);

//     // Handle unexpected errors
//     callback(error, null);
//   }
// }

// db.getConnection()
//   .then(() => {
//     console.log('Database connected successfully');
//   })
//   .catch((err) => {
//     console.error('Database connection failed:', err.message);
//   });

//   // async function getTableNames() {
//   //   try {
//   //     const [rows] = await db.query('SHOW TABLES');
//   //     console.log(rows); 
//   //     const tableNames = rows.map(row => row['Tables_in_your_database_name']); // Extract table names
//   //     return tableNames; 
//   //   } catch (error) {
//   //     console.error('Error retrieving table names:', error);
//   //     return []; // Return an empty array in case of error
//   //   }
//   // }

//   // getTableNames()

// // console.log("proto.QueueService.service,",protoQueue)
// server.addService(protoQueue.OrderService.service, { PlaceOrder: processOrder ,GetOrderHistory:getHistory});
// server.bindAsync(
//   PORT,
//   grpc.ServerCredentials.createInsecure(),
//   (error, port) => {
//     if (error) {
//       console.error('Failed to start server:', error.message);
//       return;
//     }
//     console.log(`Server 2 running on port ${port}`);
//   },
// );

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql2');
const db = require('./db/dbConnection'); // Assuming you have this file exporting your db connection
const createSchema = require('./db/createSchema');

// Path to your .proto file
const PROTO_PATH = __dirname + '/src/../protos/rabbit.proto';

// Load and parse the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoQueue = grpc.loadPackageDefinition(packageDefinition).order;

const PORT = '0.0.0.0:50052';
const server = new grpc.Server();

// Create and use the connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '112233-a',
  database: 'orders_dbs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const dbPromise = pool.promise(); // Using promise-based API for database queries

// Function to handle database interactions
async function getOrderById(orderId) {
  try {
    const [rows] = await dbPromise.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    return rows[0]; // Assuming we only want the first row
  } catch (err) {
    console.error('Database query failed:', err.message);
    throw err;
  }
}

// Implementing gRPC service methods
const orderService = {
  getOrder: async (call, callback) => {
    const orderId = call.request.id;
    try {
      const order = await getOrderById(orderId);
      if (order) {
        callback(null, { order }); // Send the order data to the client
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: 'Order not found',
        });
      }
    } catch (err) {
      callback({
        code: grpc.status.INTERNAL,
        details: 'Error fetching order',
      });
    }
  },
};

// Function to check if any records exist in the 'orders' table
async function checkIfDataExists() {
  try {
    createSchema().then(response => console.log(response));
    const [rows] = await dbPromise.query('SELECT COUNT(*) AS count FROM orders');
    if (rows[0].count > 0) {
      console.log('There are records in the orders table.');
    } else {
      console.log('No records found in the orders table.');
    }
  } catch (err) {
    console.error('Error while checking data:', err.message);
  }
}

// Call the function
checkIfDataExists();


// Bind the service to the server
server.addService(protoQueue.OrderService.service, orderService);

// Establish MySQL connection and start the server once the connection is successful
db.getConnection()
  .then(() => {
    console.log('Database connected successfully');

    // Start the gRPC server
    server.bindAsync(
      PORT,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          console.error('Failed to start server:', error.message);
          return;
        }
        console.log(`Server 2 running on port ${port}`);
      }
    );
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });
