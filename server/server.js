const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const User = require("./models/user");
const dotenv = require("dotenv");
dotenv.config();

const typeDefs = gql`
  type Query {
    user(id: ID!): User!
  }
  type Mutation {
    addUser(userInput: UserInput!): User!
  }

  type User {
    _id: ID!
    email: String!
    password: String!
  }

  input UserInput {
    email: String!
    password: String!
  }
`;

const resolvers = {
  Query: {
    user: async (paren, args, context, info) => {
      try {
        const user = await User.findOne({ _id: args.id });

        return {
          ...user._doc,
        };
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    addUser: async (parent, args, context, info) => {
      try {
        const user = new User({
          email: args.userInput.email,
          password: args.userInput.password,
        });

        const result = await user.save();
        console.log("IM MONGOOSE RESULT");
        console.log(result);

        return {
          ...result._doc,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

const db = process.env.DB_URL;

const server = new ApolloServer({ typeDefs, resolvers });

const PORT = process.env.PORT || 5000;
mongoose.connect(db,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    server.listen(PORT,()=>{
        console.log(`Running running on port ${PORT}`)
    });
}).catch( err => {
    console.log(err)
});
