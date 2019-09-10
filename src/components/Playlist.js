import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Playlist.scss";

const Item = ({ songName, albumName, artist, index, changeSongFromChild }) => {
  const changeSong = e => {
    e.preventDefault();
    changeSongFromChild(index);
  };
  return (
    <div className="playlist__restSongs">
      <ul className="playlist__restSongsItem">
        <li>{`Track : ${songName}`}</li>
        <li>{`Album : ${albumName}`}</li>
        <li>{`Artist : ${artist}`}</li>
      </ul>
      <button onClick={changeSong}>PLAY</button>
    </div>
  );
};

const Playlist = ({ playlist, offset, changeSongFromChild }) => {
  const [currentSong, setCurrentSong] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function getSongInfo() {
      const data = await Promise.all(
        playlist.map(async songId => {
          const result = await axios
            .post("/spotify/track", { songId })
            .then(res => {
              const songInfo = {
                key: songId,
                name: res.data.name,
                album: res.data.album.name,
                artist: res.data.album.artists[0].name,
                image: res.data.album.images[1].url
              };
              return songInfo;
            });
          return Promise.resolve(result);
        })
      );
      setCurrentSong(data[offset]);
      setSongs(data);
    }
    getSongInfo();
  }, [playlist, offset]);

  return (
    <div className="playlist__container">
      <div className="playlist__restSongsContainer">
        {songs.length > 0
          ? songs.map((song, index) => (
              <Item
                songName={song.name}
                albumName={song.album}
                artist={song.artist}
                image={song.image}
                offset={offset}
                index={index}
                changeSongFromChild={changeSongFromChild}
              ></Item>
            ))
          : ""}
      </div>
      {currentSong !== undefined ? (
        <div className="playlist__currentSongContainer">
          <ul className="playlist__currentSongItem">
            <li>{`Track : ${currentSong.name}`}</li>
            <li>{`Album : ${currentSong.album}`}</li>
            <li>{`Artist : ${currentSong.artist}`}</li>
          </ul>
          <img src={currentSong.image} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Playlist;
