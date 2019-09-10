import React from "react";
import axios from "axios";
// import Recognition from "./Recognition";

const Login = () => {
  const handleLogin = async () => {
    const response = await axios.get("/spotify/authorize");
    window.open(response.data);
  };

  return (
    <div className="signup">
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Login;
