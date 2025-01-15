// dataService.js

module.exports = {
    SendDataToServer: (call, callback) => {
      console.log('Received data in SendDataToServerRPC:', call.request.data);
      callback(null, { message: 'Data received in SendDataToServerRPC successfully!' });
    },
  
    SendDataUserData: (call, callback) => {
      console.log('Received data in SendDataUserData:', call.request.data);
      callback(null, { message: 'Data received in SendDataUserData successfully!' });
    },
  
    SendDataUserProfile: (call, callback) => {
      console.log('Received data in SendDataUserProfile:', call.request.data);
      callback(null, { message: 'Data received in SendDataUserProfile successfully!' });
    },
  };
  