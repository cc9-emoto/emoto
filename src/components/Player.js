import React, { useState } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import "../styles/Player.scss"

const Player = () => {
  const [playlist, setPlaylist] = useState(["spotify:track:1rgiqIuUwPGob8JH3e6zWX", "spotify:track:6BwClo5W3VvTzJv8bvZXDD"]);

  return <SpotifyPlayer 
    token={"BQCyD2TzpnwqjVEIPdmTWXaR901gMiPu8oC0VcbRJGSTcdP3fjFkTFS1ljDJd6DzWPcAcN3hLQKkxzR9dMNjtxq3jNxU-BOoSBrR8UItbCfUMCymdOf77izHQkbZwwj-J1gvz7BjBUlhdU-OYuEORB_zijVVh2AZODkiojJg3tyi-VgudDvtps16pA"}
    uris={playlist}
    autoPlay={true}
    magnifySliderOnHover={true}
    play={true}
  />
}

export default Player;