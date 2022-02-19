const express = require("express");
const app = express();
const graphql = require("graphql");
const { graphqlHTTP } = require("express-graphql");
//this is the mock db
const mockData = [
  {
    id: 1,
    name: "Saptarshi",
    email: "test@test.com",
  },
];

// similar to the user model
const userType = new graphql.GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    email: { type: graphql.GraphQLString },
  }),
});

// for create, update, delete
const mutation = new graphql.GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: userType,
      args: {
        name: { type: graphql.GraphQLString },
        email: { type: graphql.GraphQLString },
      },
      resolve(parent, args) {
        mockData.push({
          id: mockData.length + 1,
          name: args.name,
          email: args.email,
        });
        return args;
      },
    },
  },
});

//For get properties
const rootQuery = new graphql.GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers: {
      type: new graphql.GraphQLList(userType),
      resolve(parent, args) {
        return mockData;
      },
    },
    user: {
      type: userType,
      args: { id: { type: graphql.GraphQLInt } },
      resolve(parent, args) {
        return mockData.find((data) => data.id === args.id);
      },
    },
  },
});

const schema = new graphql.GraphQLSchema({
  query: rootQuery, //basically GET
  mutation: mutation, //CREATE, UPDATE, DELETE
});

// * This has to be at the bottom
app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));
app.listen(3001, () => {
  console.log("Server running at 3001");
});
