import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";

const app = new Hono();

// Database connection settings
const dbClient = new Client({
  user: "postgres",
  password: "Secret1234!", // Ensure this matches the actual password
  database: "postgres",
  hostname: "localhost",
  port: 5432,
});

//docker run --name booking_system_batabase -e POSTGRES_PASSWORD=Secret1234! -d -p 5432:5432 postgres

// Connect to the database
await dbClient.connect();

// Route: User Registration
app.post("/register", async (c) => {
  try {
    // Extract form data from JSON body
    const { pseudonym, email, password, age } = await c.req.json();

    // Validation
    if (!pseudonym || !email || !password || !age) {
      return c.json({ error: "All fields are required" }, 400);
    }

    if (age < 15) {
      return c.json({ error: "User must be at least 15 years old" }, 400);
    }

    // Hash email (SHA-256)
    const emailHashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(email)
    );
    const emailHash = Buffer.from(emailHashBuffer).toString("hex");

    // Hash password (using bcrypt)
    const passwordHash = await hashPassword(password);

    // Assign role 'reserver' by default
    const role = "reserver"; 

    // Insert user into database
    await dbClient.queryArray(
      `INSERT INTO xyz789_users (pseudonym, email_hash, password_hash, role, age, consent)
       VALUES ($1, $2, $3, $4, $5, TRUE)`,
      pseudonym,
      emailHash,
      passwordHash,
      role,
      age
    );

    // Respond with success message
    return c.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Registration failed" }, 500);
  }
});

// Helper function to hash passwords using bcrypt
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const salt = crypto.getRandomValues(new Uint8Array(16)); // Random salt
  const hashedPassword = await crypto.subtle.importKey(
    "raw",
    salt,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    hashedPassword,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  return Buffer.from(key).toString("base64");
}

app.get("/", async (c) => {
  try {
    const html = await Deno.readTextFile("./index.html");
    return c.html(html);
  } catch (err) {
    console.error(err);
    return c.text("Error loading the HTML file", 500);
  }
});

// app-listen({port:8000});
Deno.serve(app.fetch);