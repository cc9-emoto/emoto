/* eslint-disable react-hooks/exhaustive-deps */
<<<<<<< HEAD
import React, { useEffect } from "react";
=======
import React from "react";
>>>>>>> master
import SpotifyPlayer from "react-spotify-web-playback";
import "../styles/Player.scss";

const Player = ({
  token,
  playlist,
  offset,
  setOffset,
  requestNewToken,
  toggleCapture,
  playerPlaying
}) => {

  const logCallback = state => {
    if (state.error === "Authentication failed") requestNewToken();
    switch (state.type) {
      case "track_update": {
        if (state.nextTracks.length === 0) {
          toggleCapture();
          setOffset(playlist.length - 1);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <SpotifyPlayer
      token={token}
      uris={playlist}
      magnifySliderOnHover={true}
      play={playerPlaying}
      callback={logCallback}
      offset={offset}
    />
  );
};

export default Player;
