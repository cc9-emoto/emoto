import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'
import Player from '../components/Player'

const Dashboard = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const user = Cookies.get('emoto-access');
    setToken(user);
  }, []);

  const requestNewToken = async () => {
    const refreshToken = Cookies.get('emoto-refresh');
    const response = await axios.post('/spotify/reauthorize', { refreshToken });
    Cookies.set('emoto-access', response.data)
  }

  return (
    <div>
      <h1>DASHBOARD</h1>
      <Player token={token} />
      <button onClick={requestNewToken}>PRESS ME</button>
    </div>
  )
}

export default Dashboard;