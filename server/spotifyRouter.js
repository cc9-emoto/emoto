const express = require('express');
const axios = require('axios');
const spotifyRouter = express.Router();

const db = require('../db/db.js');
const User = require('../db/User.js');
const Song = require('../db/Song.js')

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId : process.env.SPOTIFY_CLIENT_ID,
  clientSecret : process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri : "http://localhost:4000/spotify/callback"
});

const scopes = [
  "streaming", 
  "user-read-email", 
  "user-read-private",
  "user-read-playback-state", 
  "user-modify-playback-state",
  "user-top-read"
]

const calculateEmoIndex = ({ valence, energy, mode }) => {
  return (valence + energy + mode ) / 3;
}

spotifyRouter.use('/authorize', (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.send(authorizeURL);
})

spotifyRouter.post('/reauthorize', async (req, res) => {
  const { refreshToken } = req.body;
  spotifyApi.setRefreshToken(refreshToken);
  const response = await spotifyApi.refreshAccessToken();
  console.log(response);
  res.send(response.body["access_token"]);
})

spotifyRouter.get("/callback", (req, res) => {
  const authorizationCode = req.query.code;
  
  spotifyApi.authorizationCodeGrant(authorizationCode)
  .then(async (data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    const userData = await spotifyApi.getMe();

    const foundUser = await User.findOne({spotifyId: userData.body['id']}).exec();
    if (foundUser === null) {
      const newUser = await new User({
        email: userData.body['email'], 
        spotifyId: userData.body['id'],
      })
      newUser.save();

      const topTrackData = await spotifyApi.getMyTopTracks({limit: 50});
      const topTrackIds = topTrackData.body.items.map((song)=>song.id);
      const musicFeatures = await spotifyApi.getAudioFeaturesForTracks(topTrackIds);

      for (const song of musicFeatures.body["audio_features"]) {
        const { valence, mode, energy, id } = song
        const newSong = await new Song({ 
          userId: newUser.spotifyId,
          songId: id, 
          emoIndex: calculateEmoIndex({valence, mode, energy })
        })
        newSong.save();
      }
    }

    if (!authorizationCode) {
      res.redirect('/');
    } else {
      res.cookie('emoto-id', userData.body['id']);
      res.cookie('emoto-access', data.body['access_token']);
      res.cookie('emoto-refresh', data.body['refresh_token']);
      res.redirect(`http://localhost:3000/onboarding`);
    }

  }, function(err) {
    console.log('Something went wrong when retrieving the access token!', err.message);
  });
});

module.exports = spotifyRouter;