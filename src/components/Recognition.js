import React, { Component } from "react";
import axios from "axios";
import WebcamCapture from "./WebcamCapture";
import Cookies from "js-cookie";
import "../styles/Webcam.scss";

class Recognition extends Component {
  submitData = async base64 => {
    const response = await axios.post("/azure", {
      base64,
      userID: "abcde"
    });
    return response.data;
  };

  getCaptureImage = async webCamData => {
    const feelings = await this.submitData(webCamData);
    const token = Cookies.get("emoto-access");
    const uid = Cookies.get("emoto-id");
    this.props.getNewSong(
      feelings.happiness + 0.5 * feelings.neutral,
      token,
      uid
    );
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
