##Security Check Report for the Booking System

This report presents the five most critical issues identified during the security inspection of the booking system.

### **1. Unauthorized Access**

**Problem**
Users without the correct roles or permissions can create bookings, which can lead to unauthorized actions in the system. Anyone who wants to do damage can reserve huge amounts for an endless period of time, when normal reservation would not be possible from others.

**How I found it?**
A manual code review revealed that the 'POST/resources' and 'POST/reservation' routes lack access control checks.

**How I should fix it?**
The solution is role-based access control. In this way, it is possible to restrict the creation of resources only to system administrators and the making of reservations only to logged-in users. 

There is example: 
  ```javascript
if (!session || session.role !== 'admin') {
      return new Response('Unauthorized', { status: 403 });
  }
  ```
### **2. Insecure Session Management**

**Problem**
Session cookies lack essential security attributes such as 'HttpOnly', 'Secure' and 'SameSite'.

**How I found it?**
Examined session management logic and found missing attributes in the cookie headers

**How I should fix it?**
Update cookie settings to include the following:
  ```javascript
  'Set-Cookie': 'session_id=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
  ```

### **3. SQL - Injection Vulnerability in 'getUserUUID' Fuction**

**Problem**
The `getUserUUID` function constructs SQL queries using string interpolation, exposing the system to SQL injection.

**How I found it?**
Reviewed database query logic and identified unsafe queries in the `getUserUUID` function.

**How I should fix it?**
Use parameterized queries to sanitize inputs. Example:
  ```javascript
  const query = 'SELECT user_token FROM xyz789_users WHERE username = $1';
  const result = await client.queryArray(query, [username]);
  ```

### **4. Weak Content-Security-Policy Header**

**Problem**
The `Content-Security-Policy` header is insufficient, allowing dangerous sources such as inline scripts.

**How I found it?**
Examined security headers set by the `FregoSecurityHeaders` middleware and found inadequate restrictions.

**How I should fix it?**
Update the `Content-Security-Policy` header as follows:
  ```javascript
  response.headers.set('Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self'; " +
      "style-src 'self'; " +
      "img-src 'self'; " +
      "frame-ancestors 'none'; " +
      "form-action 'self'; " +
      "base-uri 'self'; " +
      "object-src 'none';"
  );
  ```

### **5. Hardcoded Database Table Names**

**Problem**
Hardcoded table names (e.g., `xyz789_users`, `xyz789_reservations`) reduce code flexibility and increase maintenance difficulties.

**How I found it?**
Detected hardcoded table names in SQL queries within the `getUserUUID` function and other operations.

**How I should fix it?**
Use environment variables or configuration constants for table names. Example:
  ```javascript
  const USERS_TABLE = Deno.env.get('USERS_TABLE') || 'xyz789_users';
  const query = `SELECT user_token FROM ${USERS_TABLE} WHERE username = $1`;
  ```