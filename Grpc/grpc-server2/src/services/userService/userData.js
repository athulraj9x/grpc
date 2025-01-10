function userData(call, callback) {
    const userData = {
      _id: '66bc4e919ca55a020005f4fc',
      name: 'Ankit',
      username: 'ak01',
      email: '',
      password: '$2b$10$gtO1FY7X7CskwRu7FlXpaOxpiBiaHwMjR4mvi1RUEu36I8386KSWK',
      passwordText: 'Ak@1234',
      emailVerify: null,
    };
    callback(null, userData);
  }

module.exports = userData;