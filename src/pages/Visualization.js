import React, { useEffect, useState } from "react";
import anime from "animejs";
import "../styles/Visualization.scss";

import data from "../data.json";

const Visualization = () => {
  const [time, setTime] = useState(0);
  const beats = new Set(
    data.beats.map(beat => Math.ceil((beat.start * 1000) / 100) * 100)
  );

  useEffect(() => {
    startTicker();
  }, []);

  useEffect(() => {
    if (beats.has(time)) animate();
  }, [time, beats]);

  const startTicker = () => {
    setInterval(() => setTime(prevState => prevState + 100), 100);
  };
  const animate = () => {
    anime({
      targets: ".circle",
      direction: "alternate",
      scale: [
        { value: 0.95, easing: "easeInOutQuad", duration: 200 },
        { value: 1, easing: "easeInOutQuad", duration: 200 }
      ],
      delay: anime.stagger(5, { grid: [25, 30], from: "center" })
    });
  };

  const renderCircles = () => {
    const array = [];
    for (let x = 0; x <= 120; x = x + 4) {
      for (let y = 0; y <= 100; y = y + 4) {
        array.push(<circle className="circle" cx={x} cy={y} r="0.5" />);
      }
    }
    return array;
  };

  return (
    <div className="visualization">
      <button className="BEATBUTTON" onClick={animate}>
        BEAT!
      </button>
      <div className="timer">{time}</div>
      <div></div>
      <svg viewBox="0 0 100 55">{renderCircles()}</svg>
    </div>
  );
};

export default Visualization;
