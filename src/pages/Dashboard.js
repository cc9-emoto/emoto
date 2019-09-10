/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Visualization from "../components/Visualization";
import Animation from "../components/Animation";
import Recognition from "../components/Recognition";
import Player from "../components/Player";
import "../styles/Dashboard.scss";

const Dashboard = () => {
  const [token, setToken] = useState("");
  const [offset, setOffset] = useState(0);
  const [playerPlaying, setPlayerPlaying] = useState(false);

  const [beats, setBeats] = useState([]);
  const pushToBeats = newBeats => {
    setBeats(prevState => [...prevState, newBeats]);
  };

  const [loudness, setLoudness] = useState([]);
  const pushToLoudness = newLoudness => {
    setLoudness(prevState => [...prevState, newLoudness]);
  };

  const [playlist, setPlaylist] = useState([]);
  const pushToPlaylist = spotifyURI => {
    setPlaylist([...playlist, spotifyURI]);
  };

  const [capture, setCapture] = useState(false);
  const toggleCapture = () => {
    setCapture(!capture);
  };

  useEffect(() => {
    const user = Cookies.get("emoto-access");
    setToken(user);
    resetAdded();
    startingTwo();
  }, []);

  useEffect(() => {
    if (playlist.length === beats.length && beats.length > 0)
      setPlayerPlaying(true);
  }, [playlist, beats]);

  useEffect(() => {
    if (playlist.length === loudness.length && loudness.length > 0)
      setPlayerPlaying(true); // what is this?
  }, [playlist, loudness]);

  const resetAdded = async () => {
    const user = Cookies.get("emoto-id");
    await axios.post("/graphql", {
      query: `mutation {
        resetAdded (userId: "${user}")
      }`
    });
  };

  const startingTwo = async () => {
    const user = Cookies.get("emoto-id");
    const starting = [];
    const response = await axios.post("/graphql", {
      query: `
      query {
        startingTwo (userId: "${user}") {
          songId
        }
      }
    `
    });
    for (const item of response.data.data.startingTwo) {
      starting.push(`spotify:track:${item.songId}`);
      // getBeats(item.songId);
    }
    setPlaylist([...playlist, ...starting]);
  };

  const requestNewToken = async () => {
    const refreshToken = Cookies.get("emoto-refresh");
    const response = await axios.post("/spotify/reauthorize", { refreshToken });
    Cookies.set("emoto-access", response.data);
    setToken(response.data);
  };

  const getNewSong = async (value = 0.5, token, uid) => {
    const response = await axios.post("/graphql", {
      query: `
      query {
        matchingSong (value: ${value}, token: "${token}", uid: "${uid}") {
        songId
        }
      }
    `
    });
    const newSongId = response.data.data.matchingSong.songId;
    console.log(`Got a new song! ${newSongId}`);
    pushToPlaylist(`spotify:track:${newSongId}`);
    // getBeats(newSongId);
  };


  const getBeats = async songId => {
    const accessToken = Cookies.get("emoto-access");
    const response = await axios.post("/spotify/analyze", {
      songId,
      accessToken
    });
    pushToBeats(response.data.beats);
    pushToLoudness(response.data.sections);
  };

  return (
    <div className="dashboard">
      <div className="dashboard__top">
        <Recognition capture={capture} getNewSong={getNewSong} />
        {/* <Visualization
          beatsData={beats[offset]}
          playerPlaying={playerPlaying}
        /> */}
        {/* <Animation
          beatsData={beats[offset]}
          loudnessData={loudness[offset]}
          playerPlaying={playerPlaying}
        /> */}
      </div>
      <div className="dashboard__bottom">
        <Player
          playerPlaying={playerPlaying}
          token={token}
          playlist={playlist}
          requestNewToken={requestNewToken}
          toggleCapture={toggleCapture}
          getNewSong={getNewSong}
          offset={offset}
          setOffset={setOffset}
        />
      </div>
    </div>
  );
};

export default Dashboard;
