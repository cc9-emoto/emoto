import React, { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import "../styles/Player.scss"

const Player = ({ token, playlist, requestNewToken, getNewSong }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    requestNewToken();
  }, [])

  const logCallback = (state) => {
    if (state.error === "Authentication failed") requestNewToken();
    switch(state.type) {
      case "track_update": {
        const duration = state.track.durationMs;
        getNewSong();
        setOffset(state.position)
        console.log(state.position);
        console.log(state);
        break;
      }
      default: 
        break;
    }
  }

  return <SpotifyPlayer 
    token={token}
    uris={playlist}
    autoPlay={true}
    magnifySliderOnHover={true}
    play={true}
    callback={logCallback}
    offset={offset}
  />
}

export default Player;