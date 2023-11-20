
const User = require("../models/User");
const { GraphQLError } = require("graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();



const resolvers = {
  Mutation: {
    signup: async (_, { signupInput: { User_ID, User_Email, User_Password, User_Type} }) => {
      // const oldUser = await User.findUserByEmail({ email });
      // if (oldUser)
      //   throw new GraphQLError("User with same email already exists", {
      //     extensions: {
      //       code: "USER_ALREADY_EXISTS",
      //     },
      //   });

      try {
        var encryptedPassword = await bcrypt.hash(User_Password, 10);
        console.log('Password hashed successfully');
        const user = User.initializeDatabase({
          User_ID: User_ID,
          User_Email: User_Email.toLowerCase(),
          User_Password: encryptedPassword,
          User_Type: User_Type
        });
        console.log('user is done');
        const token = jwt.sign(
          {
            User_ID: user.User_ID,
            User_Email: user.User_Email,
            User_Type: user.User_Type,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        user.token = token;
        const res = await user.save();

        return {
          User_ID: res.User_ID,
          ...res._doc,
        };
      } catch (err) {
        throw new GraphQLError("User couldn't be saved to system", {
          extensions: {
            code: "USER_NOT_SAVED",
          },
        });
      }
    },
    login: async (_, { loginInput: { email, password } }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError("Can't find such user. Signup first", {
          extensions: {
            code: "USER_NOT_FOUND",
          },
        });
      } else if (await bcrypt.compare(password, user.password)) {
        if (user.User_Type === "student") {
          const token = jwt.sign(
            {
              user_id: user.User_ID,
              email: user.User_Email,
              role: user.User_Type,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1d",
            }
          );
          user.token = token;
        } else {
          const token = jwt.sign(
            {
              user_id: user.User_ID,
              email: user.User_Email,
              role: user.User_Type,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "30d",
            }
          );
          user.token = token;
        }
        return {
          id: user.id,
          ...user._doc,
        };
      } else {
        throw new GraphQLError("Incorrect Password", {
          extensions: {
            code: "INCORRECT_PASSWORD",
          },
        });
      }
    },
  },
  Query:{
    allUser: async (_) => {
      try {
        const allUser = await User.find();
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
