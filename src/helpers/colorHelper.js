const colorHelper = {
  getHexFromEmotion: (value) => {
    const randomFactor = 25;
    const rValue = Math.max(Math.min(Math.round(255 * value + (Math.random(-0.5))*randomFactor), 255), 0);
    const gValue = Math.max(Math.min(Math.round((255 * (1 - Math.abs(value - 0.5)*2) + (Math.random()-0.5)*randomFactor )), 255), 0);
    const bValue = Math.max(Math.min(Math.round((255 * (1 - value)+ (Math.random()-0.5)*randomFactor)), 255), 0);
    return rValue.toString(16).padStart(2, "0") + gValue.toString(16).padStart(2, "0") + bValue.toString(16).padStart(2, "0");
    // return (Math.round(Math.random()*255)).toString(16) + (Math.round(Math.random()*255)).toString(16) + (Math.round(Math.random()*255)).toString(16)
  }
}

export default colorHelper;