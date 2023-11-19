
const User = require("../models/User");
const { GraphQLError } = require("graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// email and username same
const resolvers = {
  Mutation: {
    signup: async (_, { signupInput: { username, email, password } }) => {
      const oldUser = await User.findOne({ email });
      if (oldUser)
        throw new GraphQLError("User with same email already exists", {
          extensions: {
            code: "USER_ALREADY_EXISTS",
          },
        });

      try {
        var encryptedPassword = await bcrypt.hash(password, 10);
        const user = new User({
          username: username,
          email: email.toLowerCase(),
          password: encryptedPassword,
        });
        const token = jwt.sign(
          {
            user_id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        user.token = token;
        const res = await user.save();

        return {
          id: res.id,
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
        if (user.role === "customer") {
          const token = jwt.sign(
            {
              user_id: user._id,
              username: user.username,
              email: user.email,
              role: user.role,
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
              user_id: user._id,
              username: user.username,
              email: user.email,
              role: user.role,
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
