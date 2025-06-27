WTWR (What to Wear?): Back End
`Project Description`

`WTWR (What to Wear?)` is a weather-based clothing recommendation application. The back-end service powers the core functionality of the app by managing user accounts, handling authentication, storing weather-related clothing items, and serving data to the front-end. It acts as the server-side infrastructure that enables CRUD operations for users and clothing items while maintaining security and data integrity.

## Functionality

- User authentication and authorization (sign-up, login, token validation)
- Add, delete, and view clothing items
- Manage user profiles 
- Serve data dynamically to front-end clients

## Technologies and Techniques Used

- Node.js and Express.js — for building the server and routing
- MongoDB and Mongoose — for database operations and schema modeling
- JWT (JSON Web Tokens) — for secure authentication
- CORS middleware — for handling cross-origin requests `(Not added yet Downloaded)`
- ESLint — for code linting and consistency

### Running the Project

To start the server:
`npm run start`

To start the server with hot reloading:
`npm run dev`

To run eslint:
`npx eslint`
