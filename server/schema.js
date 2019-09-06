const { gql } = require('apollo-server-express');
const typeDefs = gql`
  type User {
    email: String
    uid: String
    token: String
  }
  type Song {
    songId: String
  }

  type Query {
    user(token: String): User
    matchingSong(value: Float): Song
  }

  type Mutation {
    createUser(email: String, password: String): User
    createSession(email: String, password: String): User
    resetAdded: Boolean
  }

`;

module.exports = { typeDefs };

// startingTwo: [Song]  