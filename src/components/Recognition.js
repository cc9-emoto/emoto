import React, { Component } from "react";
import axios from "axios";
import WebcamCapture from "./WebcamCapture";

//The component which send image data to Azure to get info
class Recognition extends Component {
  constructor(prop) {
    super(prop);
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
    // if (baseData.indexOf(BASE64_MARKER) === -1) {
    //   const parts = baseData.split(",");
    //   const contentType = parts[0].split(":")[1];
    //   const raw = decodeURIComponent(parts[1]);
    //   console.log("line25, it works?");
    //   return new Blob([raw], { type: contentType });
    // }
    const parts = baseData.split(BASE64_MARKER);
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    // const blobData = new Blob([uInt8Array], {
    //   type: contentType,
    //   encoding: "utf-8"
    // });

    const file = new File([uInt8Array], "image", { type: contentType });

    this.setState({ sendData: file });
    // const image = new Promise((resolve, reject) => {
    //   const fr = new FileReader();
    //   fr.onload = resolve; // CHANGE to whatever function you want which would eventually call resolve
    //   fr.readAsDataURL(blobData);
    // });
    // image.then(res => {
    //   console.log(res.currentTarget.result);
    // });
    // this.setState({
    //   sendData: image
    // });
  };

  //submit to Azure API with params
  submitData = base64 => {
    // const subscriptionKey = process.env.REACT_APP_AZURE_API_KEY;
    // const config = {
    //   "Content-Type": "application/octet-stream",
    //   "Ocp-Apim-Subscription-Key": subscriptionKey
    // };

    // const fr = new FileReader();
    // const image = await fr.readAsText(this.state.sendData, "utf-8");
    // await console.log("from line 52", image);
    axios
      .post("/azure", { base64 })
      .then(res => {
        console.log("line 63 in recognition.js", res);
      })

      .catch(error => {
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
        return "it's error";
      });
  };

  getCaptureImage = async webCamData => {
    await this.makeblob(webCamData);
    console.log(this.state.sendData);
    await this.submitData(webCamData);
  };

  render() {
    return (
      <div>
        <WebcamCapture getCaptureImage={this.getCaptureImage}></WebcamCapture>
      </div>
    );
  }
}

export default Recognition;
