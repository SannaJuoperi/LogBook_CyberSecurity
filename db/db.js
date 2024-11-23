import { Client } from "https://deno.land/x/postgres/mod.ts";

// Set up PostgreSQL client connection
const client = 
new Client({
  user: "postgres",        // DB email
  database: "postgres",    // DB name
  hostname: "localhost",   // DB host
  password: "Secret1234!", // DB password (change this as needed)
  port: 5432,              // Default PostgreSQL port
});

// Connect to the database
await client.connect();

export default client;
