import { Hono } from "https://deno.land/x/hono/mod.ts";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import { registerUser } from "./routes/register.js"; // Import register logic

const app = new Hono();

// Serve static files from the /static directory
app.use('/static/*', serveStatic({ root: './' }));

// Serve the registration form
app.get('/register', async (c) => {
  return c.html(await Deno.readTextFile('./views/register.html'));
});

// Route for user registration (POST request)
app.post('/register', registerUser);

Deno.serve(app.fetch);

// Run the app using the command:
// deno run --allow-net --allow-env --allow-read --watch app.js

// Docker commands
// docker run --name booking_system_database -e POSTGRES_PASSWORD=Secret1234! -d -p 5432:5432 postgres
// docker exec -it booking_system_database psql -U postgres