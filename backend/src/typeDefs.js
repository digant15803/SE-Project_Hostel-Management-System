const { gql } = require("graphql-tag");

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
    oldPassword: String
    newPassword: String
    confirmPassword: String
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
  input mstudentId{
    studentId: String
  }

  type Response{
    already: Boolean
    flag: Boolean
  }
  type PlaceCount {
    hostelMessLunchCount: Int
    collegeLunchCount: Int
    hostelMessTeaCount: Int
    collegeTeaCount: Int
  }
  type place {
    studentId: String
    lunchPlace: String
    teaPlace: String
  }

  type Query{
    allUser: [User]
    timeSlots: [timeSlot]
    slotAvailable(slotCheck: slotCheck): Available
    placecount: PlaceCount
  }

  type Mutation {
    signup(signupInput: signupInput): signUp
    login(loginInput: loginInput): Token
    changePwd(changePwd: changePwd): Token
    rcSlotBooking(slotBook: slotBook): Response
    mealUpdate(mstudentId: mstudentId): Response
  }

`;
