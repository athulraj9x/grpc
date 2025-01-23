import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql", // or 'postgres'
  host: "localhost",
  port: 3306, // For MySQL; use 5432 for PostgreSQL
  username: "your_username",
  password: "your_password",
  database: "your_database",
  synchronize: true, // Set to false in production
  logging: false,
  entities: ["src/entity/**/*.ts"], // Path to your entities
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});
