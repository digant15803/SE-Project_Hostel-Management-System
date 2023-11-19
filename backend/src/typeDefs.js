const { gql } = require("graphql-tag");

// need to change by own schema
module.exports = gql`
  type Query {
    allUser: [User]

  }

  type Mutation {
    signup(signupInput: signupInput): User
    login(loginInput: loginInput): User
    registerEmployee(signupInput: signupInput): User
  }

  scalar DateTime

  type User {
    username: String
    email: String
    password: String
    token: String
    role: String
  }

  input signupInput {
    username: String
    email: String
    password: String
  }

  input loginInput {
    email: String
    password: String
  }

`;
