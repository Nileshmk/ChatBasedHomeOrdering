// database
const mongoose = require("mongoose");

const keys = require("./config/keys");

const roomSchema = require('./models/roomSchema');

mongoose.connect(keys.mongodb.dbOrg1, () => {
    console.log("connected to mongodb..");
  },{ useFindAndModify: false });

// grpc loadings

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// loading protoLoader
const packageDef = protoLoader.loadSync("./proto/todo.proto",{});
const roomObject = grpc.loadPackageDefinition(packageDef);
const roomPackage = roomObject.todoPackage;

// FCM loaders
var admin = require('firebase-admin');

var serviceAccount = require("./kartoch-creds.json");

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kartoch-2324.firebaseio.com"
});
try{
    
}catch(err){
    console.log(err);
}

// initialize grpc server
const server = new grpc.Server()
server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());
server.addService(roomPackage.Todo.service,
{
    "createMessage":createMessage,
    "readMessageStream":readMessageStream
});

server.start();

function createMessage(call, callback){
    try{
        roomSchema.findOne({roomID:call.request.room.roomID},(err,result)=>{
            if(err) throw err;
            if(result){
                let msg = {
                    timestamp: new Date(),
                    messageid:result.messages.length+1,
                    messageText:call.request.msg.messageText,
                    userid:call.request.msg.userid,
                    firstName:call.request.msg.firstName,
                    lastName:call.request.msg.lastName
                }
                result.messages.push(msg);
                const store = result.save();
                sendFcm("fik_cGkcSX6hHyVsRfrp1L:APA91bGPzDTitWgj5jd697L8BgfB4melpitIP2YKTX0mh7NEhbOwE-QZ4XnIUy4XL7HIlqQ3jHtWkOyU1T2h1mMrrVl4uLkDtSCI5ml9klvwEHLWiEZjyknwXfxoxZI3-xO34aLotuJN","updated",(err,result)=>{
                    if(err) throw err;
                    if(result){
                        callback(null,msg);
                    }
                    else{
                        console.log("something problem");
                    }
                });
            }
            else{
                throw new Error('Exception message');
            }
        });
    }
    catch(err){
        let msg = {
            timestamp: new Date(),
            messageid:-1,
            messageText:"hello",
            userid:call.request.msg.userid,
            firstName:call.request.msg.firstName,
            lastName:call.request.msg.lastName
        }
        callback(null,msg);
    }
    // roomSchema.findOneAndUpdate({roomID: call.request.room.roomID}, {$push: {messages: call.request.msg}});
    
}

function readMessageStream(call,callback){
    try{
        roomSchema.findOne({roomID:call.request.room.roomID},(err,result)=>{
            if(err) throw err;
            if(result){
                for(let i = call.request.index;i<result.messages.length;i++){
                    console.log(t);
                    call.write(t);
                }
                call.end();
            }
            else{
                throw new Error("roomNotFound");
            }
        });
    }
    catch(err){
        let msg = {
            timestamp: new Date(),
            messageid:1,
            messageText:"hello",
            userid:"hello",
            firstName:"hello",
            lastName:"hello"
        };
        msgs = [];
        msgs.push(msg);
        msgs.forEach(t=> call.write(t));
        call.end();
    }
}

// sending FCM request to one client
function sendFcm(token,box,callback){
    var registrationToken = token;
    var message = {
      data : {
          "message":box
        },
      token: registrationToken
    };
    app.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      return callback(null,response);
    })
    .catch((error) => {
       return callback(error,null);
      // console.log('Error sending message:', error);
    });
}

// sending FCM request to multiple client
// async function sendFcmM(token,box,callback){
//     var registrationToken = token;
//     var message = {
//       data : box,
//       token: registrationToken
//     };
//     await app.messaging().send(message)
//     .then(async (response) => {
//       // Response is a message ID string.
//       return callback(null,response);
//       // console.log('Successfully sent message:', response, "\ni:",i);
//     })
//     .catch((error) => {
//       return callback(error,null);
//       // console.log('Error sending message:', error);
//     });
    
//   }