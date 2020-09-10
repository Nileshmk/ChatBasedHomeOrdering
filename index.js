// database
var path = __dirname;
const mongoose = require("mongoose");
const keys = require("./config/keys");

mongoose.connect(keys.mongodb.dbOrg, () => {
    console.log("connected to mongodb..");
  },{ useFindAndModify: false });

// grpc loadings

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// loading messagePackage
// const packageDef = protoLoader.loadSync(path+"/proto/messageProto.proto",{});
// const messageObject = grpc.loadPackageDefinition(packageDef);
// const messagePackage = messageObject.messagePackage;

// loading roomPackage
const packageDefr = protoLoader.loadSync(path+"/proto/roomProto.proto",{});
const roomObject = grpc.loadPackageDefinition(packageDefr);
const roomPackage = roomObject.roomPackage;

// initialize grpc server
const server = new grpc.Server()
server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());

// const { createMessage, readMessageStream } = require('./modules/messageRoutes');
// server.addService(messagePackage.MessageProto.service,
// {
//     "createMessage":createMessage,
//     "readMessageStream":readMessageStream
// });

const { placeOrder } = require('./modules/roomRoutes');
const { createMessage, getAllMessages,getRecentMessageUpdate} = require("./modules/messageRoutes");
const {getDutyEmployees, assignEmployeeTask} = require("./modules/employeeRoutes");
const { getOptionVersion } = require('./modules/optionRoutes');
const { getOrder,updateOrder } = require('./modules/orderRoutes');


server.addService(roomPackage.roomProto.service,
{
    "placeOrder":placeOrder,
    "createMessage":createMessage,
    "getAllMessages":getAllMessages,
    "getRecentMessageUpdate":getRecentMessageUpdate,
    "getDutyEmployees":getDutyEmployees,
    "assignEmployeeTask":assignEmployeeTask,
    "getOptionVersion":getOptionVersion,
    "getOrder":getOrder,
    "updateOrder":updateOrder
});

server.start();

