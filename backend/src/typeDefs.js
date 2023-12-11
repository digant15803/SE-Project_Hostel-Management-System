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
  input updateplace{
    studentId: String
    lunchPlace: String
    teaPlace: String
  }
  
  type allStudents {
    name: String
    username: String
    roomNo: Int
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
  type roomDetail{
    roomNo: Int
    studentId1: String
    studentId2: String
    studentId3: String
  }

  type roomBookingDetails{
    roomNo: Int
    studentId: String
    bedSheetChange:Boolean
    time: String
  }
  type RoomCleaningDetails {
    roomNo: Int
    studentId: String
    bedSheetChange: Boolean
    time: String
  }

  type Query{
    allUser: [User]
    timeSlots: [timeSlot]
    slotAvailable(slotCheck: slotCheck): Available
    placecount: PlaceCount
    roomDetails: [roomDetail]
    allStudents: [allStudents]
    roomBookingDetails: [roomBookingDetails]
    studentRoomCleaningDetails: [RoomCleaningDetails]
  }

  type Mutation {
    signup(signupInput: signupInput): signUp
    login(loginInput: loginInput): Token
    changePwd(changePwd: changePwd): Token
    rcSlotBooking(slotBook: slotBook): Response
    mealUpdate(mstudentId: mstudentId): Response
    updatePlace(updateplace: updateplace): Response
  }

`;
