const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const PORT = 4000;
const axios = require("axios");
// const multer = require("multer");
const fs = require("fs");
const base64ToImage = require("base64-to-image");

const app = express();
const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");
const spotifyRouter = require("./spotifyRouter");

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.use(express.json());
app.use("/spotify", spotifyRouter, express.json());
app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// console.log("undienfed", upload.single("image"));
// app.use(bodyParser.json());
// const imageBuffer = fs.readFileSync("image.jpg");
app.use(express.json({ limit: "10mb" }));
app.post("/azure", (req, res) => {
  const image = req.body.base64;
  console.log(image);
  let base64 = image.split(";base64,").pop();
  const file = new Promise((res, rej) => {
    fs.onload = res;
    return fs.writeFile("image.png", base64, { encoding: "base64" });
  });
  file.then(res => console.log("hello", res));
  // console.log("line22", req.body);
  // const b64string = req.body.base64;
  // const buf = Buffer.from(b64string, "base64");
  // const arraybuf = new ArrayBuffer(buf.length);
  // const view = new Uint8Array(arraybuf);
  // for (let i = 0; i < buf.length; ++i) {
  //   view[i] = buf[i];
  // }

  // submitData();

  function submitData() {
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
      data: buf,
      params: params
    };

    axios
      .request(config)
      .then(res => {
        const emotion = res.data[0].faceAttributes.emotion;
        console.log(emotion);
      })

      .catch(error => {
        console.log("error?", error.response.data);
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
        return emotionErrCase;
      });
  }
});
