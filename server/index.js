const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const PORT = 4000;
const axios = require("axios");
const fs = require("fs");

const app = express();
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers')
const spotifyRouter = require('./spotifyRouter')
const { print } = require('graphql');

class BasicLogging {
  requestDidStart({queryString, parsedQuery, variables}) {
    const query = queryString || print(parsedQuery);
    console.log(query);
    console.log(variables);
  }

  willSendResponse({graphqlResponse}) {
    console.log(JSON.stringify(graphqlResponse, null, 2));
  }
}

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
  extensions: [() => new BasicLogging()]
});
server.applyMiddleware({ app });

// app.use(express.json());
app.use("/spotify", spotifyRouter, express.json());
app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
app.use(express.json({ limit: "50mb" }));
app.post("/azure", async (req, res) => {
  //create image file and read
  let result;
  const b64string = req.body.base64;
  const base64Data = b64string.replace(/^data:image\/jpeg;base64,/, "");
  fs.writeFileSync(`${req.body.userID}.jpeg`, base64Data, "base64");

  const imageBuffer = fs.readFileSync(`${req.body.userID}.jpeg`);

  //post image file to Azure, get response emotion from Azure
  const submitData = async () => {
    let apiReturn;
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
      data: imageBuffer,
      params: params
    };

    apiReturn = await axios
      .request(config)
      .then(res => {
        return res.data[0].faceAttributes.emotion;
      })
      .catch(function(error) {
        //leave console.log to check error from Azure
        console.log("error!", error);
        const errorRes = {
          anger: 0,
          contempt: 0,
          disgust: 0,
          fear: 0,
          happiness: 0,
          neutral: 1,
          sadness: 0,
          surprise: 0
        };
        return errorRes;
      });
    return apiReturn;
  };
  result = await submitData();
  await res.send(result);
});
