import React, { Component } from "react";
import axios from "axios";
import WebcamCapture from "./WebcamCapture";
import "../styles/Webcam.scss";

class Recognition extends Component {
<<<<<<< HEAD
  submitData = base64 => {
    axios
      .post("/azure", { base64, userID: "abcde" })
      .then(res => {
        console.log(res.data);
        const apiRes = res.data;
        this.setState({ responseFromAPI: apiRes });
      })
      .catch(error => error);
=======
  submitData = async base64 => {
    const response = await axios.post("/azure", { base64, userID: "abcde" });
    return response.data;
>>>>>>> master
  };

  getCaptureImage = async webCamData => {
    const feelings = await this.submitData(webCamData);
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
