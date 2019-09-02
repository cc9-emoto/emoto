const db = require('../db/db.js');
const bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken')

const User = require('../db/User')
const Session = require('../db/Session')

const resolvers = {
  Query: {
    user: async(_, { token }) => {
      const session = await Session.findOne({token}).exec();
      const uid = session.user;
      const foundUser = await User.findOne({uid}).exec();
      return { email: foundUser.email, uid, token }
    }
  },
  Mutation: {
    createUser: async (_, {email, password}) => {
      const foundUser = await User.findOne({ email }).exec(); 
      if (foundUser === null) {
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(password, salt);
        const uid = uuid();
        const token = jwt.sign({ uid, email }, 'emoto');
        await User.create({ email, uid, password: hashed, password_salt: salt });
        await Session.create({ user: uid, token })
        return { email, uid, token };
      }
    },
    createSession: async (_, {email, password}) => {
      const foundUser = await User.findOne({email}).exec();
      if (foundUser !== null && bcrypt.compareSync(password, foundUser.password)) {
        const token = jwt.sign({ uid: foundUser.uid, email: foundUser.email }, 'asanalab');
        await Session.create({ user: foundUser.uid, token })
        return { uid: foundUser.uid, email: foundUser.email, token };
      } else {
        return {email: "", uid: ""};
      }
    },
  }
};

module.exports = { resolvers };