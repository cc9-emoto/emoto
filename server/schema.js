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
    matchingSong(value: Float, token: String, uid: String): Song
    startingTwo(userId: String): [Song]
  }

  type Mutation {
    createUser(email: String, password: String): User
    createSession(email: String, password: String): User
    resetAdded(userId: String): Boolean
  }

`;

module.exports = { typeDefs };