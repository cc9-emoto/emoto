import React from "react";
import axios from "axios";
import spotifyLogo from '../assets/images/spotifyLogo.png'

const Login = () => {
  const handleLogin = async () => {
    const response = await axios.get("/spotify/authorize");
    window.open(response.data);
  };

  return (
    <div className="login">
      <button onClick={handleLogin}>
        <img src={spotifyLogo} alt="Spotify Logo"/>
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
