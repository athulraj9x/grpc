const sqlite3 = require("sqlite3").verbose();

async function createSchema() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("orders_dbs.db", (err) => {
      if (err) {
        return reject(`Failed to connect to database: ${err.message}`);
      }
      console.log("Connected to the SQLite database.");

      // Enable foreign key constraints
      db.run("PRAGMA foreign_keys = ON;", (err) => {
        if (err) {
          console.error("Failed to enable foreign key constraints:", err.message);
        }
      });

      db.serialize(() => {
        // Create the Orders table
        db.run(
          `
          CREATE TABLE IF NOT EXISTS Orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId TEXT NOT NULL,
            status TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            customerId INTEGER,
            addressId INTEGER,
            FOREIGN KEY (addressId) REFERENCES Address(id)
          )
          `,
          (err) => {
            if (err) {
              return reject(`Error creating Orders table: ${err.message}`);
            }
            console.log("Orders table checked/created successfully.");
          }
        );

        // Create the Address table
        db.run(
          `
          CREATE TABLE IF NOT EXISTS Address (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            street TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            postalCode TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
          `,
          (err) => {
            if (err) {
              return reject(`Error creating Address table: ${err.message}`);
            }
            console.log("Address table checked/created successfully.");
          }
        );

        // Function to add missing columns
        const addColumnIfMissing = (tableName, columnName, columnDefinition) => {
          db.all(`PRAGMA table_info(${tableName});`, (err, columns) => {
            if (err) {
              console.error(`Error fetching columns for ${tableName}:`, err.message);
              return;
            }

            const columnExists = columns.some((col) => col.name === columnName);
            if (!columnExists) {
              console.log(`Adding missing column '${columnName}' to table '${tableName}'`);
              db.run(
                `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`,
                (err) => {
                  if (err) {
                    console.error(
                      `Error adding column '${columnName}' to table '${tableName}':`,
                      err.message
                    );
                  } else {
                    console.log(
                      `Column '${columnName}' added successfully to table '${tableName}'`
                    );
                  }
                }
              );
            }
          });
        };

        // Add missing columns
        // addColumnIfMissing("Orders", "stock", "INTEGER");

        console.log("Table schema check completed!");
      });

      // Close the database after completing operations
      db.close((err) => {
        if (err) {
          return reject(`Failed to close the database: ${err.message}`);
        }
        console.log("Database connection closed.");
        resolve(true);
      });
    });
  });
}

module.exports = createSchema;
