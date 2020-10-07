let app = require('../config/firebase');
async function sendFcmToUser(userlist,userid,message){
    temp = new Object();
    for(let j = 0;j<userlist.length;j++){
        if(userlist[j].id in temp){

        }
        else{
            if(userlist[j].id!=userid){
                await sendFcm(userlist[j].firebaseuserid,message,(err,result)=>{
                    // if(err) throw err;
                    console.log(`${err} ${result}`)
                });
            }
            temp[userlist[j].id]=1;
        }
    }
}

function sendFcm(token,box,callback){
    if(token==null){
    return callback(error,null);
  }
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

module.exports = {sendFcmToUser,sendFcm};