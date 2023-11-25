const { gql } = require("graphql-tag");

// need to change by own schema
module.exports = gql`
  type User{
    username: String
    position: String
    id: String
    name: String
    roomNo: Int
  }
  type signUp{
    username: String
    id: String
    name: String
  }
  input signupInput {
    username: String
    position: String
    id: String
    name: String
  }
  input loginInput {
    username: String
    password: String
  }
  input changePwd {
    username: String
    password: String
  }


  type Query{
    allUser: [User]
  }
  type Mutation {
    signup(signupInput: signupInput): signUp
    login(loginInput: loginInput): User
    changePwd(changePwd: changePwd): User
  }

`;
