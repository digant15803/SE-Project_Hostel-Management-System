const { GraphQLError } = require("graphql");
const bcrypt = require("bcrypt");
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
          return {
            username: user.username,
            position: user.position,
            id: student.studentId,
            name: student.name,
            roomNo: student.roomNo,
          };
        } else {
          const manager = await models.manager.findOne({ where: { username: user.username }},{raw: true}).catch(function (err) {
            throw new GraphQLError("Manager not found.", {
              extensions: {
                code: "Manager_Not_Found",
              },
            });
          });
          return {
            username: user.username,
            position: user.position,
            id: manager.managerId,
            name: manager.name,
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
  }
};

module.exports = resolvers;
