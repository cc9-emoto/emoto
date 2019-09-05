import React, { Component } from "react";
import axios from "axios";
import WebcamCapture from "./WebcamCapture";
import '../styles/Webcam.scss'

//The component which send image data to Azure to get info
class Recognition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: "",
      sendData: "",
      responseFromAPI: {},
      webCamData: "",
      preview: ""
    };
  }

  //create blob for sending data to azure
  makeblob = function(baseData) {
    const BASE64_MARKER = ";base64,";
    if (baseData.indexOf(BASE64_MARKER) === -1) {
      const parts = baseData.split(",");
      const contentType = parts[0].split(":")[1];
      const raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
    }
    const parts = baseData.split(BASE64_MARKER);
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    this.setState({
      sendData: new Blob([uInt8Array], { type: contentType })
    });
  };

  //submit to Azure API with params
  submitData = async () => {
    const subscriptionKey = process.env.REACT_APP_AZURE_API_KEY;
    const uriBase =
      "https://emoto.cognitiveservices.azure.com/face/v1.0/detect";

    const params = {
      returnFaceId: "true",
      returnFaceLandmarks: "false",
      returnFaceAttributes:
        "age,gender,headPose,smile,facialHair,glasses,emotion," +
        "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };

    const config = {
      baseURL: uriBase,
      method: "post",
      headers: {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": subscriptionKey
      },
      processData: false,
      data: this.state.sendData,
      params: params
    };

    const emotionErrCase = {
      anger: 0,
      contempt: 0,
      disgust: 0,
      fear: 0,
      happiness: 0,
      neutral: 1,
      sadness: 0,
      surprise: 0
    };

    const response = await axios.request(config);
    if (response.data.length > 0) {
      return response.data[0].faceAttributes.emotion;
    } else {
      return emotionErrCase;
    }
        
  };

  getCaptureImage = async webCamData => {
    await this.makeblob(webCamData);
    const feelings = await this.submitData();
    const feelingValue = feelings.happiness + 0.5 * feelings.neutral;
    console.log(`feelingValue: ${feelingValue}`);
    this.props.getNewSong(feelingValue);
  };

  render() {
    return (
      <div className="webcam__wrapper">
        <WebcamCapture getCaptureImage={this.getCaptureImage} capture={this.props.capture} />
      </div>
    );
  }
}

export default Recognition;
