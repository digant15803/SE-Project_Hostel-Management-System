const { gql } = require("graphql-tag");

// need to change by own schema
module.exports = gql`
  type User{
    User_ID: String
    User_Email: String
    User_Password: String
    User_Type: String
  }
  input signupInput {
    User_ID: String
    User_Email: String
    User_Password: String
    User_Type: String
  }
  type Query{
    allUser: [User]
  }

  input loginInput {
    User_Email: String
    User_Password: String
  }

  type Mutation {
    signup(signupInput: signupInput): User
    login(loginInput: loginInput): User
  }

`;
