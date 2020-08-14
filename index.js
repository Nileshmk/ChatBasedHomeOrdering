// database
const mongoose = require("mongoose");
const keys = require("./config/keys");

mongoose.connect(keys.mongodb.dbOrg, () => {
    console.log("connected to mongodb..");
  },{ useFindAndModify: false });

// grpc loadings

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// loading messagePackage
const packageDef = protoLoader.loadSync("./proto/MessageProto.proto",{});
const messageObject = grpc.loadPackageDefinition(packageDef);
const messagePackage = messageObject.messagePackage;

// loading roomPackage
const packageDefr = protoLoader.loadSync("./proto/roomProto.proto",{});
const roomObject = grpc.loadPackageDefinition(packageDefr);
const roomPackage = roomObject.roomPackage;

// initialize grpc server
const server = new grpc.Server()
server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());

const { createMessage, readMessageStream } = require('./modules/messageRoutes');
server.addService(messagePackage.MessageProto.service,
{
    "createMessage":createMessage,
    "readMessageStream":readMessageStream
});

const { placeOrder } = require('./modules/roomRoutes');
server.addService(roomPackage.roomProto.service,
{
    "placeOrder":placeOrder
});

server.start();

