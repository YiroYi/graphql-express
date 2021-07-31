const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const bodyParser = require("body-parser");
const { buildSchema } = require("graphql");
const expressPlayground =
  require("graphql-playground-middleware-express").default;
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/user");

dotenv.config();

app.use(bodyParser.json());
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
            type RootQuery {
                hello: String!
            }
            type RootMutation{
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

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
    rootValue: {
      addUser: async (args) => {
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
      hello: () => {
        return "Hello back!!";
      },
    },
    graphiql: true,
  })
);


const db = process.env.DB_URL;

const PORT = process.env.PORT || 5000;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Running running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
