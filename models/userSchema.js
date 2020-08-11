const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  address: [{              
      byGoogle : {
          address : String ,
            city : String ,
            state : String ,
            country : String ,
            postalcode : String,
            loc : { type: { type : String } , coordinates : [] },
       },
       byUser : {
         addressTag : String,
         userAddress : String,
         Landmark : String
       }
  }],
  profilePicture : String,
  profileType : String,
  loginType : String,
  employment: String,
  location : String,
  username: String,
  password: String,
  status : String,
  contact: {
    type:String,
    unique:true
  },
  // changes
  loginType: String,
  profileUrl:String,
  otp: {
    type:String,
    default:null
  },
  otpTimestamp: {
    type:Date,
    default:null
  },
  firebaseuserid: {
    type:String,
    default: null
  }
});


module.exports = mongoose.model("User",userSchema);




