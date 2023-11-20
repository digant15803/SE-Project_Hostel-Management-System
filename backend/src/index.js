const util = require('util');
const mysql = require('mysql');
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const context = require("../middleware/auth");
// const dotenv=require('dotenv');
require('dotenv').config();

const con = mysql.createConnection({
  host: process.env.MYSQL_IP,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_LOGIN,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.DB_NAME
});

const connectPromise = util.promisify(con.connect).bind(con);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: "http://localhost:3000/",
    credentials: true,
  },
});

connectPromise()
  .then(() => {
    console.log("Connection with MySQL established");
    return startStandaloneServer(server, {
      listen: { port: process.env.PORT },
      context: context,
    });
  })
  .then((server) => {
    console.log(`🚀  Server ready at: ${server.url}`);
  })
  .catch((error) => {
    console.error("Error connecting to MySQL:", error);
  });
