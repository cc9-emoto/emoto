const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const PORT = 4000;

const app = express();
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers')
const spotifyRouter = require('./spotifyRouter')
const { print } = require('graphql');

class BasicLogging {
  requestDidStart({queryString, parsedQuery, variables}) {
    const query = queryString || print(parsedQuery);
    console.log(query);
    console.log(variables);
  }

  willSendResponse({graphqlResponse}) {
    console.log(JSON.stringify(graphqlResponse, null, 2));
  }
}

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
  extensions: [() => new BasicLogging()]
});
server.applyMiddleware({ app });

app.use(express.json());
app.use('/spotify', spotifyRouter, express.json())
app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)