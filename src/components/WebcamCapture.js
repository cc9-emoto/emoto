import React from "react";
import Webcam from "react-webcam";

//The component to get base64 data through webcam
class WebcamCapture extends React.Component {
  constructor(prop) {
    super(prop);
    this.setRef = webcam => {
      this.webcam = webcam;
    };
  }

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.props.getCaptureImage(imageSrc);
  };

  timer = () => {
    setInterval(() => {
      this.capture();
    }, 10000);
  };

  componentDidMount() {
    this.timer();
  }

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };

    return (
      <Webcam
        audio={false}
        height={250}
        ref={this.setRef}
        screenshotFormat="image/jpeg"
        width={445}
        videoConstraints={videoConstraints}
      />
    );
  }
}

export default WebcamCapture;
