const express = require("express");
const axios = require("axios");
const spotifyRouter = express.Router();

const db = require("../db/db.js");
const User = require("../db/User.js");
const Song = require("../db/Song.js");

const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:4000/spotify/callback"
});

const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-top-read"
];

const calculateEmoIndex = ({ valence, energy, mode }) => {
  return (valence + energy + mode) / 3;
};

spotifyRouter.use("/authorize", (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.send(authorizeURL);
});

spotifyRouter.post("/reauthorize", async (req, res) => {
  const { refreshToken } = req.body;
  spotifyApi.setRefreshToken(refreshToken);
  const response = await spotifyApi.refreshAccessToken();
  // console.log(response);
  res.send(response.body["access_token"]);
});

spotifyRouter.post("/analyze", async (req, res) => {
  const { songId, accessToken } = req.body;
  spotifyApi.setAccessToken(accessToken);
  try {
    const response = await spotifyApi.getAudioAnalysisForTrack(songId);
    res.send(response.body);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
});

spotifyRouter.get("/callback", (req, res) => {
  const authorizationCode = req.query.code;

  spotifyApi.authorizationCodeGrant(authorizationCode).then(
    async data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
      spotifyApi.setRefreshToken(data.body["refresh_token"]);
      const userData = await spotifyApi.getMe();

      const foundUser = await User.findOne({
        spotifyId: userData.body["id"]
      }).exec();
      if (foundUser === null) {
        const newUser = await new User({
          email: userData.body["email"],
          spotifyId: userData.body["id"]
        });
        newUser.save();

        const topTrackData = await spotifyApi.getMyTopTracks({ limit: 5 });
        const trackIds = topTrackData.body.items.map(song => song.id);
        songList(newUser.spotifyId, trackIds)
      }

      if (!authorizationCode) {
        res.redirect("/");
      } else {
        res.cookie("emoto-id", userData.body["id"]);
        res.cookie("emoto-access", data.body["access_token"]);
        res.cookie("emoto-refresh", data.body["refresh_token"]);
        res.redirect(`http://localhost:3000/onboarding`);
      }
    },
    function(err) {
      console.log(
        "Something went wrong when retrieving the access token!",
        err.message
      );
    }
  );
});

const songList = async (spotifyId, trackIdList) => {
  const musicFeatures = await spotifyApi.getAudioFeaturesForTracks(
    trackIdList
  );
  for (const song of musicFeatures.body["audio_features"]) {
    const { valence, mode, energy, id } = song;
    try {
      const newSong = await new Song({
        userId: spotifyId,
        songId: id,
        emoIndex: calculateEmoIndex({ valence, mode, energy })
      });
      newSong.save();
    } catch (err) {
      console.log(err.message);
    }
  }
}

spotifyRouter.post("/recommended", async (req, res) => {
  const { songId, accessToken, spotifyId } = req.body;
  spotifyApi.setAccessToken(accessToken);
  try {
    const response = await spotifyApi.getRecommendations({ seed_tracks: songId });
    const trackIdList = response.body.tracks.map(song => song.id)
    songList(spotifyId, trackIdList);
    res.send(response.body.tracks)
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = spotifyRouter;
