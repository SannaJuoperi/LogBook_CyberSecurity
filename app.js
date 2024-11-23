// app.js
import { Hono } from "https://deno.land/x/hono/mod.ts";
import { registerUser } from "./routes/register.js"; // Import register logic

const app = new Hono();

// Serve the registration form
app.get('/register', async (c) => {
  return c.html(await Deno.readTextFile('./views/register.html'));
});

// Route for user registration (POST request)
app.post('/register', registerUser);

console.log('Server running on http://localhost:8000');
Deno.serve(app.fetch);

// Run the app using the command:
// deno run --allow-net --allow-env --allow-read --watch app.js

// Docker commands
// docker run --name booking_system_database -e POSTGRES_PASSWORD=Secret1234! -d -p 5432:5432 postgres
// docker exec -it booking_system_database psql -U postgres