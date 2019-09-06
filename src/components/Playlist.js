import React, { useState, useEffect } from "react";
import axios from "axios";

const Item = ({ song, index }) => {
  return <div>{song.name}</div>;
};

const Playlist = ({ playlist }) => {
  console.log(playlist);
  const [songs, setSongs] = useState([
    {
      key: "1",
      name: "song1"
    },
    {
      key: "2",
      name: "songs2"
    },
    {
      key: "3",
      name: "songs3"
    },
    {
      key: "4",
      name: "songs4"
    }
  ]);

  // const getSongs = async () => {
  //   console.log("test");
  //   const response = await axios.post("/graphql", {
  //     query: `
  //     query{

  //     }`
  //   });
  // };

  return (
    <div>
      {songs.map((song, index) => (
        <Item song={song} index={index}></Item>
      ))}
    </div>
  );
};

export default Playlist;
