import React from "react";
import Webcam from "react-webcam";

//The component to get base64 data through webcam
class WebcamCapture extends React.Component {
  constructor(props) {
    super(props);
    this.setRef = webcam => {
      this.webcam = webcam;
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.capture !== this.props.capture) this.songCapture();
  }

  componentDidMount = () => {
    setInterval(() => this.emotionCapture(), 10000);
  }

  songCapture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.props.getSongFromCapture(imageSrc);
  };

  emotionCapture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.props.getEmotionFromCapture(imageSrc);
  }

  render() {
    const videoConstraints = {
      width: 450,
      height: 250,
      facingMode: "user"
    };

    return (
      <div>
        <Webcam
          audio={false}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      </div>
    );
  }
}

export default WebcamCapture;
