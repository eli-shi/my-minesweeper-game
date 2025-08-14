### Overview

Current main purpose of the api is to help with user authencation. The projects authentication method is through JWT(Jsonwebtoken)
The base URL of this API is /api/user (with userRoutes mounted, can be found in index.js in the server folder)
I suggest using [Postman](https://www.postman.com/) for sending requests.

### Authentication

- **Endpoints**:
    - `POST /api/user/signup`: Create a new user account.
    - `POST /api/user/login`: Authenticate a user and return a token.
- **Request Format**:
    - Headers: `Content-Type: application/json`
    - Body:
        
        {
        
          "name": "string",
        
          "email": "string",
        
          "password": "string"
        
        }
        
- **Response**:
    - Success: HTTP 200 with a token.
    - Error: HTTP 400 with an error message.


### Error Handling

No common errors have appeared yet, but once they will, they will be documented here

### Examples of requests with Postman

![[Screenshot 2025-05-02 at 09.46.27.png]]
![[Screenshot 2025-05-02 at 09.46.44.png]]

### Security

**JSON Web Tokens:**
JWT are a great way of authenticating users compared to saving sessions.
JWT consists of:
- header
- payload
- signature
each one separated by a dot

Authentication with JWT
1. user logs in with their information
2. server verifies information and sends a JWT which contains users information
3. this JWT is then sent to the client and saved on their local storage so they stay logged on until the JWT expires


