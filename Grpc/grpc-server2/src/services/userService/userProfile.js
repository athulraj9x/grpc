function userProfile(call, callback) {
    const userProfile = {
      _id: '66bc4e919ca55a020005f4fc',
      name: 'Ankit',
      username: 'ak01',
      email: '',
      password: '$2b$10$gtO1FY7X7CskwRu7FlXpaOxpiBiaHwMjR4mvi1RUEu36I8386KSWK',
      passwordText: 'Ak@1234',
      emailVerify: null,
      twoFactorAuthPassword: '579471',
      status: '1',
      betAllow: false,
      sportsBetting: [],
      casinoBetting: [],
      exposure: [],
      resultTransaction: [],
      commission: 1,
      layersBetAllow: true,
    };
    callback(null, userProfile);
  }
  module.exports = userProfile;