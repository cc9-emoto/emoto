import React, { Component } from "react";
import axios from "axios";
import WebcamCapture from "./WebcamCapture";
import "../styles/Webcam.scss";

//The component which send image data to Azure to get info
class Recognition extends Component {
  submitData = base64 => {
    axios
      .post("/azure", { base64, userID: "abcde" })
      .then(res => {
        console.log(res.data);
        const apiRes = res.data;
        this.setState({ responseFromAPI: apiRes });
      })
      .catch(error => error);
  };

  getCaptureImage = async webCamData => {
    this.submitData(webCamData);
    const feelings = this.state.responseFromAPI;
    this.props.getNewSong(feelings.happiness + 0.5 * feelings.neutral);
  };

  render() {
    return (
      <div className="webcam__wrapper">
        <WebcamCapture
          getCaptureImage={this.getCaptureImage}
          capture={this.props.capture}
        />
      </div>
    );
  }
}

export default Recognition;
