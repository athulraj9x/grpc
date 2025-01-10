  function userOrders(call, callback) {
    const userOrders = [
      {
        parent_id: '6617d106b0edb1c713e706cd',
        role: 1,
        _id: '66aa76185d14d7d04fa8cd91',
      },
      {
        parent_id: '66aa76185d14d7d04fa8cd90',
        role: 3,
        _id: '66bc4e919ca55a020005f4fe',
      },
    ];
    callback(null, { orders: userOrders });
  }

  module.exports = userOrders;