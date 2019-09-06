/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import anime from "animejs";
import "../styles/Visualization.scss";

const Visualization = ({ beatsData = [], playerPlaying }) => {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(200);
  const beats = new Set(
    beatsData.map(beat => Math.ceil((beat.start * 1000) / 100) * 100)
  );

  useEffect(() => {
    if (beatsData.length > 0 && time === 0 && playerPlaying) {
      startTicker();
      const avgDuration =
        beatsData.reduce((acc, beat) => acc + beat.duration, 0) /
        beatsData.length;
      setDuration(avgDuration * 1000);
    }
  }, [beatsData, playerPlaying]);

  useEffect(() => {
    if (beats.has(time)) {
      animate();
    }
  }, [time, beats]);

  const startTicker = () => {
    setInterval(() => setTime(prevState => prevState + 100), 100);
  };
  const animate = () => {
    anime({
      targets: ".circle",
      direction: "alternate",
      scale: [
        { value: 0.95, easing: "easeInOutQuad", duration: duration / 2 },
        { value: 1, easing: "easeInOutQuad", duration: duration / 2 }
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
      {/* <div className="timer">{time}</div> */}
      <svg viewBox="0 0 100 55">{renderCircles()}</svg>
    </div>
  );
};

export default Visualization;
