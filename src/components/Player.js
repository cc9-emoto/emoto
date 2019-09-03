import React, { useState } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import "../styles/Player.scss"

const Player = ({ token }) => {
  const [playlist, setPlaylist] = useState(["spotify:track:1rgiqIuUwPGob8JH3e6zWX", "spotify:track:6BwClo5W3VvTzJv8bvZXDD"]);

  return <SpotifyPlayer 
    token={token}
    uris={playlist}
    autoPlay={true}
    magnifySliderOnHover={true}
    play={true}
  />
}

export default Player;