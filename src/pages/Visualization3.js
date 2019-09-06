import React, { useEffect, useState } from "react";
import anime from "animejs";
import "../styles/Visualization.scss";
import data from "../data.json";

const Visualization3 = () => {
  const [time, setTime] = useState(0);
  const beats = new Set(
    data.beats.map(beat => Math.ceil((beat.start * 1000) / 100) * 100)
  );
  const [counter, setCounter] = useState(0);

  const animate = () => {
    anime({
      targets: ".rectangle",
      height: function(e, i, l) {
        return (Math.sin(i + counter) + 2) * 25;
      }
    });
    setCounter(counter + 1);
  };

  const startTicker = () => {
    setInterval(() => setTime(prevState => prevState + 100), 100);
  };

  useEffect(() => {
    startTicker();
  }, []);

  useEffect(() => {
    if (beats.has(time)) animate();
  }, [time]);

  const renderRectangles = () => {
    const array = [];
    for (let i = 0; i < 100; i++) {
      array.push(
        <rect
          key={i}
          className="rectangle"
          x={i}
          height={(Math.sin(i) + 2) * 25}
          width={0.5}
          style={{ fill: "#0000FF" }}
        />
      );
    }
    return array;
  };

  return (
    <div>
      <svg className="vis3" viewBox="0 0 100 55">
        {renderRectangles()}
      </svg>
    </div>
  );
};

export default Visualization3;
