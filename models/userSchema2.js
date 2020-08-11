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
  contact: String,
  profilePicture : String,
  profileType : String,
  employment: String,
  location : String,
  username: String,
  password: String,
  status : String
}

);
