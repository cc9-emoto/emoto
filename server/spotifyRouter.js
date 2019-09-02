const express = require('express');
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


const calculateEmoIndex = ({ valence, energy, mode }) => {
  return (valence + energy + mode ) / 3;
}

spotifyRouter.use('/authorize', (req, res) => {
  const scopes = ["playlist-read-private", "user-read-email", "user-top-read"]
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
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
    // const tokenExpirationEpoch = (new Date().getTime() / 1000) + data.body['expires_in'];

    const newUser = await new User({
      email: userData.body['email'], 
      spotifyId: userData.body['id'],
      refreshToken: data.body['refresh_token'],
      accessToken: data.body['access_token']
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

  }, function(err) {
    console.log('Something went wrong when retrieving the access token!', err.message);
  });
});

module.exports = spotifyRouter;