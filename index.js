// database
const mongoose = require("mongoose");

const keys = require("./config/keys");

const roomSchema = require('./models/roomSchema');

mongoose.connect(keys.mongodb.dbOrg1, () => {
    console.log("connected to mongodb..");
  },{ useFindAndModify: false });


// let temp = new roomSchema({
//     roomID: new ObjectId(),
//     orderid: new ObjectId()
// });
// temp.save();
//GRPC Server

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// loading protoLoader
const packageDef = protoLoader.loadSync("todo.proto",{});
const roomObject = grpc.loadPackageDefinition(packageDef);
const roomPackage = roomObject.todoPackage;

const server = new grpc.Server()
server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());
server.addService(roomPackage.Todo.service,
{
    "createMessage":createMessage,
    "readMessageStream":readMessageStream
});

server.start();

function createMessage(call, callback){
    // database
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
                callback(null,msg);
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
                // console.log(result.messages);
                // result.messages.forEach(t=>call.write(t));
                result.messages.forEach(t=>{
                    console.log(t);
                    call.write(t);
                });
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