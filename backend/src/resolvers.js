const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const models = require("../models");



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
        const user = await models.user.create({ username: username, password: null, position: position });
        console.log('User is created');

        if(user.position === "Student"){
          const student = await models.student.create({ studentId: id, username: user.username, roomNo: 1, name: name }).catch(function (err) {
            throw new GraphQLError("Student couldn't be saved to the database", {
              extensions: {
                code: "Student_NOT_SAVED",
              },
            });
          });
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
    changePwd: async (_, {changePwd: {username, password}}) => {
      const user = await models.user.update({password: password},{where: {username: username}}).catch(function (err){
        console.log(err);
        throw new GraphQLError("Error in changing the password.", {
          extensions: {
            code: "Password_Not_Changed",
          },
        });
      });

      try {
        const userData = await resolvers.Mutation.login(_, { loginInput: { username: username, password: password } });
        return userData;
      } catch (error) {
        throw new GraphQLError("Failed to call Mutation", {
          extensions: {
            code: "CALL_ERROR",
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
    }
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
  }
};

module.exports = resolvers;
