function SendMessage(call, callback) {
  console.log(
    `Received message from ${call.request.user}: ${call.request.message}`,
  );
  callback(null, {
    user: call.request.user,
    message: `Echo: ${call.request.message}`,
  });
}

function GetChatHistory(call, callback) {
  console.log('Fetching chat history...');
  // Simulate chat history response
  const chatHistory = ['Message 1', 'Message 2', 'Message 3'];
  callback(null, { messages: chatHistory });
}

function Chat(stream) {
  console.log('Starting chat streaming...');
  stream.on('data', (message) => {
    console.log(`Streaming message from ${message.user}: ${message.message}`);
    stream.write({ user: message.user, message: `Echo: ${message.message}` });
  });

  stream.on('end', () => {
    console.log('Chat streaming ended.');
    stream.end();
  });
}

module.exports = { SendMessage, GetChatHistory, Chat };
