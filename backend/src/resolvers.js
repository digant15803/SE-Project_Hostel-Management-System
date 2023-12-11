const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const models = require("../models");
const moment = require('moment');
const { createHmac } = require("crypto");

const secret = 'abcdefg';

const resolvers = {
  Mutation: {
    signup: async (_, { signupInput: { username, position, id, name} }) => {
      const oldUser = await models.user.findByPk(username,{ raw: true });
      if (oldUser)
        throw new GraphQLError("User with same username already exists", {
          extensions: {
            code: "USER_ALREADY_EXISTS",
          },
        });

      try {
        console.log(id);
        const pwd = JSON.stringify(createHmac('sha256', secret).update(id).digest('hex')).slice(1,-1);
        console.log(pwd);
        const user = await models.user.create({ username: username, password: pwd, position: position });
        console.log('User is created');

        if(user.position === "Student"){
          const student = await models.student.create({ studentId: id, username: user.username, roomNo: null, name: name }).catch(function (err) {
            throw new GraphQLError("Student couldn't be saved to the database", {
              extensions: {
                code: "Student_NOT_SAVED",
              },
            });
          });

          const roomDetails = await resolvers.Query.roomDetails();
          let roomN;
          for (let i = 0; i < roomDetails.length; i++) {
            if(roomDetails[i].studentId1 === null){
              roomN = roomDetails[i].roomNo;
              const addStudentDetail = await models.roomdetails.update({ studentId1: id }, { where: { roomNo: roomN } });
              break;
            }
            else if(roomDetails[i].studentId2 === null){
              roomN = roomDetails[i].roomNo;
              console.log(roomN);
              const addStudentDetail = await models.roomdetails.update({ studentId2: id }, { where: { roomNo: roomN } });
              break;
            }
            else if(roomDetails[i].studentId3 === null){
              roomN = roomDetails[i].roomNo;
              const addStudentDetail = await models.roomdetails.update({ studentId3: id }, { where: { roomNo: roomN } });
              break;
            }
          }
          const updateStudentDetail = await models.student.update({ roomNo: roomN }, { where: { studentId: id } });
          
          
        }
        else{
          const manager = await models.manager.create({ managerId: id, username: user.username, name: name }).catch(function (err) {
            throw new GraphQLError("Manager couldn't be saved to the database", {
              extensions: {
                code: "Manager_NOT_SAVED",
              },
            });
          });
        }
        
        return {
          id: id,
          name: name,
          username: user.username,
        };
      } catch (err) {
        throw new GraphQLError("User couldn't be saved to the database", {
          extensions: {
            code: "USER_NOT_SAVED",
          },
        });
      }
    },
    login: async (_, { loginInput: { username, password } }) => {
      const user = await models.user.findByPk(username,{raw: true});
      if (!user) {
        throw new GraphQLError("User not found, Create an account.", {
          extensions: {
            code: "USER_NOT_FOUND",
          },
        });
      } else if(user.password==null){
        return {
          username: null,
        };
      } else if (password===user.password) {
        if (user.position === "Student") {
          const student = await models.student.findOne({ where: { username: user.username }},{raw: true}).catch(function (err) {
            throw new GraphQLError("Student not found.", {
              extensions: {
                code: "Student_Not_Found",
              },
            });
          });
          const token = jwt.sign(
            {
              username: user.username,
              position: user.position,
              id: student.studentId,
              name: student.name,
              roomNo: student.roomNo,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "10d",
            }
          );
          return {
            token: token,
          };
        } else {
          const manager = await models.manager.findOne({ where: { username: user.username }},{raw: true}).catch(function (err) {
            throw new GraphQLError("Manager not found.", {
              extensions: {
                code: "Manager_Not_Found",
              },
            });
          });
          const token = jwt.sign(
            {
              username: user.username,
              position: user.position,
              id: manager.managerId,
              name: manager.name,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "10d",
            }
          );
          return {
            token: token,
          };
        }
      } else {
        throw new GraphQLError("Incorrect Password", {
          extensions: {
            code: "INCORRECT_PASSWORD",
          },
        });
      }
    },
    changePwd: async (_, { changePwd: { username, oldPassword, newPassword } }) => {
      const user = await models.user.findOne({ where: { username: username } });
      if (!user) {
        throw new GraphQLError("User don't exist", {
          extensions: {
            code: "USER_DOESNOT_EXIST",
          },
        });
      }  
      if(oldPassword !== user.password){
        throw new GraphQLError("Old password is incorrect", {
          extensions: {
            code: "OLD_PASSWORD_INCORRECT",
          },
        });
      }
      try {
        await models.user.update({ password: newPassword }, { where: { username: username } });
            const userData = await resolvers.Mutation.login(_, {
              loginInput: { username: username, password: newPassword },
            });
    
        return userData;
      } catch (error) {
        throw new GraphQLError("Error in changing the password", {
          extensions: {
            code: "PASSWORD_NOT_CHANGED",
          },
        });
      }
    },
    rcSlotBooking: async (_,{slotBook: {time, bedSheetChangeReq}},contextValue) => {
      contextValue = contextValue.user;
      const prevBooking = await models.roomcleaning.findByPk(contextValue.roomNo,{raw: true});
      console.log(prevBooking);
      if(prevBooking!=null){
        return {
          already: true,
        }
      }
      else{
        try {
          const userData = await resolvers.Query.slotAvailable(_, { slotCheck: { time: time } });
          if(userData.flag === true){
            const booking = await models.roomcleaning.create({roomNo: contextValue.roomNo, studentId: contextValue.id, time: time, bedSheetChange: bedSheetChangeReq}).catch(function(err){
              console.log(err);
              throw new GraphQLError("Error in adding row in roomcleaning table.", {
                extensions: {
                  code: "ROW_NOT_ADDED",
                },
              });
            })
            return{
              already: false,
              flag: true,
            }
          }
          else{
            return{
              already: false,
              flag: false,
            }
          }
        } catch (error) {
          throw new GraphQLError("Failed to call Query", {
            extensions: {
              code: "CALL_ERROR",
            },
          });
        }
      }
    },


    updatePlace: async (_, { updateplace: { studentId, lunchPlace, teaPlace } }) => {
      try {
        const [updatedRowCount] = await models.place.update(
          { lunchPlace, teaPlace },
          { where: { studentId } }
        );
  
        if (updatedRowCount > 0) {
          return {
            flag: true,
            already: false,
            message: "Place details updated successfully",
            place: {
              studentId,
              lunchPlace,
              teaPlace,
            },
          };
        } else {
          throw new GraphQLError("Error updating place details. User not found", {
            extensions: {
              code: "UPDATE_ERROR_USER_NOT_FOUND",
            },
          });
        }
      } catch (err) {
        console.error(err);
        throw new GraphQLError("Error updating place details", {
          extensions: {
            code: "UPDATE_ERROR",
          },
        });
      }
    },
  
   

    mealUpdate: async (_, { mstudentId: { studentId }}) => {
      try {
        const currentTime = moment();
        const student = await models.place.findOne({ where: { studentId: studentId }});
        if (!student) {
          return{
            already: true,
            flas:false,
            message: "User already had meal",
          };
          
        }
    
        const isLunchTime = currentTime.isBetween(moment('12:00', 'HH:mm'), moment('14:00', 'HH:mm'));
        const isTeaTime = currentTime.isBetween(moment('16:00', 'HH:mm'), moment('18:30', 'HH:mm'));
        const updatedMealDetails = await models.place.update({
            lunchPlace: isLunchTime ? 'done' : student.lunchPlace,
            teaPlace: isTeaTime ? 'done' : student.teaPlace,
          },
          { where: { studentId } }
        );
    
        if (updatedMealDetails) {
          return {
            flag: true,
            already:false,
            message: "Meal details updated successfully",
            mealDetails: {
              studentId,
              lunchPlace: isLunchTime ? 'done' : student.lunchPlace,
              teaPlace: isTeaTime ? 'done' : student.teaPlace,
            },
          };
        } else {
          throw new GraphQLError("Error updating meal details", {
            extensions: {
              code: "UPDATE_ERROR",
            },
          });
        }
      } catch (err) {
        console.error(err);
        throw new GraphQLError("Error updating meal details", {
          extensions: {
            code: "UPDATE_ERROR",
          },
        });
      }
    },
  },



  Query:{
    allUser: async (_) => {
      try {
        const allUser = await models.user.findAll({raw: true,});
        return allUser;
      } catch (err) {
        throw new GraphQLError("Error fetching items", {
          extensions: {
            code: "FETCH_ERROR",
          },
        });
      }
    },
    roomDetails: async (_) => {
      try {
        const allUser = await models.roomdetails.findAll({raw: true,});
        return allUser;
      } catch (err) {
        throw new GraphQLError("Error fetching room details", {
          extensions: {
            code: "FETCH_ERROR",
          },
        });
      }
    },
    timeSlots: async (_) => {
      try {
        const timeSlotDeatails = await models.cleaning.findAll({raw: true}).catch(function (err){
          console.log(err);
          throw new GraphQLError("Error in feching the time slot details.", {
            extensions: {
              code: "FETCH_ERROR",
            },
          });
        });
        return timeSlotDeatails;
      } catch (err) {
        throw new GraphQLError("Error fetching time slots", {
          extensions: {
            code: "FETCH_ERROR",
          },
        });
      }
    },
    slotAvailable: async (_, {slotCheck: {time}}) => {
      try {
        const timeSlotDeatail = await models.cleaning.findByPk(time,{raw: true}).catch(function (err){
          console.log(err);
          throw new GraphQLError("Error in changing the password.", {
            extensions: {
              code: "Password_Not_Changed",
            },
          });
        });
        if(timeSlotDeatail.slotsAva>0){
          const updateRow = await models.cleaning.update({slotsAva: timeSlotDeatail.slotsAva-1}, {where: {time: time}}).catch(function (err){
            console.log(err);
            throw new GraphQLError("Error in changing the row of timeslot.", {
              extensions: {
                code: "SLOT_VALUE_NOT_CHANGED",
              },
            });
          });
          return {flag: true};
        }
        else{
          return {flag: false};
        }
        
      } catch (err) {
        throw new GraphQLError("Error fetching time slots", {
          extensions: {
            code: "FETCH_ERROR",
          },
        });
      }
    },
    

    placecount: async (_) => {
      try {
        const hostelMessLunchCount = await models.place.count({ where: { lunchPlace: 'Hostel Mess' } });
        const collegeLunchCount = await models.place.count({ where: { lunchPlace: 'UC Cafeteria' } });
        const hostelMessTeaCount = await models.place.count({ where: { teaPlace: 'Hostel Mess' } });
        const collegeTeaCount = await models.place.count({ where: { teaPlace: 'UC Cafeteria' } });
        return {
          hostelMessLunchCount: hostelMessLunchCount,
          collegeLunchCount: collegeLunchCount,
          hostelMessTeaCount: hostelMessTeaCount,
          collegeTeaCount: collegeTeaCount,
        };
      } catch (err) {
        throw new GraphQLError("Error fetching place counts", {
          extensions: {
            code: "FETCH_ERROR",
          },
        });
      }
    },

    allStudents: async (_) => {
      try {
        const studentData = await models.student.findAll({
          attributes: ["name", "username", "roomNo"],
          raw: true,
          order: [['name', 'ASC']],
        });
    
        return studentData;
      } catch (err) {
        console.error("Error fetching student data:", err); 
        throw new GraphQLError("Error fetching student data", {
          extensions: {
            code: "FETCH_ERROR",
          },
        });
      }
    },

    roomBookingDetails: async (_) => {
      try {
        const roomBookingDetails = await models.roomcleaning.findAll({
          attributes: ['roomNo', 'studentId', 'bedSheetChange', 'time'],
          raw: true,
          order: [['time', 'ASC']],
        });

        return roomBookingDetails;
      } catch (error) {
        console.error('Error fetching room booking details:', error);
        throw error;
      }
    },

    studentRoomCleaningDetails: async (_, __, context) => {
      const roomNo = context.user.roomNo; 
      try {
        const cleaningDetails = await models.roomcleaning.findAll({
          where: { roomNo },
          attributes: ['roomNo', 'studentId', 'bedSheetChange', 'time'],
          raw: true,
          order: [['time', 'ASC']],
        });

        return cleaningDetails;
      } catch (error) {
        console.error('Error fetching student room cleaning details:', error);
        throw new GraphQLError('Failed to fetch student room cleaning details');
      }
    },

  }
};

module.exports = resolvers;
