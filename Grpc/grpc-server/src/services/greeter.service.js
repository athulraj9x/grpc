const client = require('../../clients/greeter.client');
const grpc = require('@grpc/grpc-js');

function callService(call, callback) {
  const method = call.request.method; // e.g., 'userData', 'userProfile', etc.
  const params = call.request.params || {}; // Parameters for the call

  console.log('method: ' + method);
  console.log('params: ' + params);

  if (client[method]) {
    client[method](params, (error, response) => {
      if (error) {
        console.error(`Error calling ${method}:`, error.message);
        callback(error, null);
        return;
      }
      callback(null, response);
    });
  } else {
    callback(
      { code: grpc.status.INVALID_ARGUMENT, message: 'Invalid method' },
      null,
    );
  }
}

module.exports = {
  callService,
};
