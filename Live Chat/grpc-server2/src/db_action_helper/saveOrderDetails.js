const db = require("../db/dbConnection");

async function saveOrderToDatabase(orderDetails) {
  const { order_id, status, delaySeconds, message, customerId, addressId } = orderDetails;

  if (!order_id || !status || !customerId || !addressId) {
    throw new Error("Missing required fields in order details.");
  }

  let connection;

  try {
    // Get a connection for the transaction
    connection = await db.getConnection();
    await connection.beginTransaction(); 
    
    // Insert the order into the database
    const query = `
      INSERT INTO Orders (orderId, status, delay_seconds, message, customerId, addressId, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const params = [order_id, status, delaySeconds, message, customerId, addressId];
    await connection.query(query, params);

    console.log('Order saved to database:', order_id);

    // Commit the transaction
    await connection.commit();

    return { success: true, message: 'Order saved successfully.', orderId: order_id };
  } catch (error) {
    // Rollback the transaction in case of an error
    if (connection) {
      await connection.rollback();
    }
    console.error('Failed to save order to database:', error.message);
    throw error;
  } finally {
    // Ensure the connection is released
    if (connection) {
      connection.release();
    }
  }
}

module.exports = { saveOrderToDatabase };
