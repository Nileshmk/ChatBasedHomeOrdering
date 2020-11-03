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

// loading employeePackage
const packageD = protoLoader.loadSync(path+"/proto/employeeProto.proto",{});
const employeeObject = grpc.loadPackageDefinition(packageD);
const employeePackage = employeeObject.employeePackage;

// loading storePackage
const packageDe = protoLoader.loadSync(path+"/proto/storeProductProto.proto",{});
const storeProductObject = grpc.loadPackageDefinition(packageDe);
const storeProductPackage = storeProductObject.storeProductPackage;

// loading imagesPackage
const packageDef = protoLoader.loadSync(path+"/proto/imagesProto.proto",{});
const imagesObject = grpc.loadPackageDefinition(packageDef);
const imagesPackage = imagesObject.imagesPackage;


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
const { getDutyEmployees, assignEmployeeTask, getEmployeeById} = require("./modules/employeeRoutes");
const { getOptionVersion } = require('./modules/optionRoutes');
const { getOrder,updateOrder,getOrderSummary } = require('./modules/orderRoutes');
const {searchStore, searchProductInStore} = require('./modules/storeProductRoutes');
const {UploadImage} = require('./modules/imagesRoutes');

server.addService(employeePackage.employeeProto.service,
{
  "getEmployeeById":getEmployeeById
});

server.addService(storeProductPackage.storeProductProto.service,
{
  "searchStore":searchStore,
      "searchProductInStore": searchProductInStore
});

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
    "updateOrder":updateOrder,
    "getOrderSummary":getOrderSummary
});

server.addService(imagesPackage.imagesProto.service,
{
 "UploadImage":UploadImage
});

server.start();

