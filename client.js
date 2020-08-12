//GRPC Server

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// loading protoLoader
const packageDef = protoLoader.loadSync("./proto/todo.proto",{});
const roomObject = grpc.loadPackageDefinition(packageDef);
const roomPackage = roomObject.todoPackage;

const client = new roomPackage.Todo("139.59.84.47:40000",
grpc.credentials.createInsecure())

const call = client.readMessageStream({
    "room": {
      "roomID": "5f316303adc3210828dbf5c5",
      "orderid": "7dab1fcf-587d-4f30-8c2d-619383f1ed03",
      "messages": [
      ]
    },
    "index": 3
  });
call.on("data", item=>{
    console.log(JSON.stringify(item))
})