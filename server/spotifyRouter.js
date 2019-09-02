const express = require('express');
const spotifyRouter = express.Router();

const db = require('../db/db.js');
const User = require('../db/User.js');

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId : process.env.SPOTIFY_CLIENT_ID,
  clientSecret : process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri : "http://localhost:4000/spotify/callback"
});

spotifyRouter.use('/authorize', (req, res) => {
  const scopes = ["playlist-read-private", "user-read-email"]
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  console.log(authorizeURL)
  res.send(authorizeURL);
})

spotifyRouter.get("/callback", (req, res) => {
  const authorizationCode = req.query.code;
  
  if (!authorizationCode) {
    res.redirect('/');
  } else {
    res.redirect('http://localhost:3000');
  }
  
  spotifyApi.authorizationCodeGrant(authorizationCode)
  .then(async (data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    const userData = await spotifyApi.getMe();
    const tokenExpirationEpoch = (new Date().getTime() / 1000) + data.body['expires_in'];

    const newUser = await new User({
      email: userData.body['email'], 
      spotifyId: userData.body['id'],
      refreshToken: data.body['refresh_token'],
      accessToken: data.body['access_token']
    })
    newUser.save();
    
    console.log(newUser);

  }, function(err) {
    console.log('Something went wrong when retrieving the access token!', err.message);
  });
});

module.exports = spotifyRouter;