const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const PORT = 4000;

const app = express();
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers')
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)

