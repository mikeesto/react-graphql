require("dotenv").config({ path: "variables.env" });
const CreateServer = require("./createServer");
const db = require("./db");

const server = CreateServer();

// TO DO: use express middleware to handle cookies

// TO DO: use express middleware to populate current user

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
