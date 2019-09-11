import React from "react";
import axios from "axios";
<<<<<<< HEAD
// import Recognition from "./Recognition";
=======
import spotifyLogo from '../assets/images/spotifyLogo.png'
>>>>>>> master

const Login = () => {
  const handleLogin = async () => {
    const response = await axios.get("/spotify/authorize");
    window.open(response.data);
  };

  return (
    <div className="login">
      <button onClick={handleLogin}>
        <img src={spotifyLogo} />
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
