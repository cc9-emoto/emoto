const colorHelper = {
  getHexFromEmotion: (value) => {
    const randomFactor = 100;
    const rValue = Math.min(Math.round(255 * value + (Math.random(-0.5))*randomFactor), 255);
    const gValue = Math.min(Math.round((255 * (1 - Math.abs(value - 0.5)*2) + (Math.random()-0.5)*randomFactor )), 255);
    const bValue = Math.min(Math.round((255 * (1 - value)+ (Math.random()-0.5)*randomFactor)), 255);
    return rValue.toString(16) + gValue.toString(16) + bValue.toString(16);
    // return (Math.round(Math.random()*255)).toString(16) + (Math.round(Math.random()*255)).toString(16) + (Math.round(Math.random()*255)).toString(16)
  }
}

export default colorHelper;