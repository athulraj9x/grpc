const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/proto/livechat.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const chatProto = grpc.loadPackageDefinition(packageDefinition).chat_bidireactional;

const client = new chatProto.ChatService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

const startChat = () => {
  const call = client.ChatRPC();

  console.log("calleds")

  // Listen for incoming messages from the server
  call.on('data', (message) => {
    console.log("call received",new Date())
    console.log(`New message from ${message.sender}: ${message.content}`);

    // After receiving a message, prompt the user to reply
    const stdin = process.openStdin();
    console.log('Type your reply and press Enter:');
    stdin.addListener('data', (data) => {
      const replyMessage = {
        sender: 'Client 1',
        content: data.toString().trim(),
      };
      
      // Send the reply to the server
      call.write(replyMessage);
    });
  });

  call.on('end', () => {
    console.log('Chat ended by server.');
  });

  call.on('error', (err) => {
    console.error('Error:', err.message);
  });

  // Initial message from client
  const stdin = process.openStdin();
  console.log('Type your message and press Enter:');
  stdin.addListener('data', (data) => {
    const message = {
      sender: 'Client 1',
      content: data.toString().trim(),
    };

    // Send the initial message to the server
    call.write(message);
  });
};

startChat();
