import React, { useEffect, useState } from "react";
import { Graphics } from "pixi.js";
import { PixiComponent, Stage, useTick } from "@inlet/react-pixi";

const Circle = PixiComponent("Circle", {
  create: props => new Graphics(),
  applyProps: (instance, _, props) => {
    instance.clear();
    instance.beginFill(0xffff00);
    instance.drawCircle(props.x, props.y, props.size);
    instance.endFill();
  }
});

const AnimatedCircle = ({ animate }) => {
  const [x, setX] = useState(250);
  const [y, setY] = useState(250);
  const [size, setSize] = useState(25);

  useEffect(() => {}, [animate]);

  useTick(delta => {});

  return <Circle x={x} y={y} size={size} />;
};

const Visualization2 = () => {
  const [ticker, setTicker] = useState(0);
  const [animate, setAnimate] = useState(false);
  const toggleAnimate = () => setAnimate(!animate);

  return (
    <>
      <button onClick={toggleAnimate}>ANIMATE</button>
      <Stage width={1440} height={800} options={{ backgroundColor: 0xffffff }}>
        <AnimatedCircle animate={animate} />
      </Stage>
    </>
  );
};

export default Visualization2;
