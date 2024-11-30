import { Hono } from "https://deno.land/x/hono/mod.ts";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import { loginUser } from "./routes/login.js";
import { registerUser } from "./routes/register.js";

// Create the Hono app
const app = new Hono();

// Serve static files from the /static directory
app.use('/static/*', serveStatic({ root: '.' }));

// Serve the index page
app.get('/', async (c) => {
  return c.html(await Deno.readTextFile('./views/index.html'));
});

// Serve the login page
app.get('/login', async (c) => {
  return c.html(await Deno.readTextFile('./views/login.html'));
});

// Handle user login
app.post('/login', loginUser);

// Serve the registration page
app.get('/register', async (c) => {
  return c.html(await Deno.readTextFile('./views/register.html'));
});

// Handle user registration
app.post('/register', registerUser);


Deno.serve(app.fetch);

// Run the app using the command:
// deno run --allow-net --allow-env --allow-read --watch app.js
// write to the browser http://localhost:8000/register
// after you have registered, write to the browser http://localhost:8000/login

// Docker commands
// docker run --name booking_system_database -e POSTGRES_PASSWORD=Secret1234! -d -p 5432:5432 postgres
// docker exec -it booking_system_database psql -U postgres