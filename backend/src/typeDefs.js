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
  type Token {
    token: String
  }
  type timeSlot{
    time: String
    slotsAva: Int
  }
  input slotCheck{
    time: String
  }
  type Available{
    flag: Boolean
  }
  input slotBook{
    time: String
    bedSheetChangeReq: Boolean
  }
  type Response{
    already: Boolean
    flag: Boolean
  }


  type Query{
    allUser: [User]
    timeSlots: [timeSlot]
    slotAvailable(slotCheck: slotCheck): Available
  }
  type Mutation {
    signup(signupInput: signupInput): signUp
    login(loginInput: loginInput): Token
    changePwd(changePwd: changePwd): Token
    rcSlotBooking(slotBook: slotBook): Response
  }

`;
