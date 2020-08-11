const mongoose = require('mongoose');

//const userSchema = new Schema({
//    username: String,
//    googleId: String,
//    thumbnail: String
//});

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    profileURL : String,
    profileType : String,
    collegeName : String,
    description : String,
    education : String,
    employment: String,
    location : String,
    joinedCourses: [String],
    username: String,
    password: String,
    fnumber : String,
    draftedCourses : [String],
    individualcreatedCourses : [String],
    organizationcreatedNcourses: [{ organizationid : String,orgName: String,courseid : [String], _id : false,id : false }],
    organizationjoinedNcourses : [{ organizationid : String,orgName: String,courseid : [String], _id : false,id : false }],
    orgstudentinfo : [ { organizationid : String, studInfo : [{ studentid: String,courseid : [String] }] ,_id : false}],
    individualStudentInfo : [{ studInfo : [{studentid : String,courseid: [String] } ] }]
});

userSchema.virtual('id').get(function(){
    return this._id;
});

const orgSchema = mongoose.Schema({
        orgName : String,
        desc: String,
        logo: String,
        members: [{ memberid: String, memberName : String, memberEmail : String, courseid: [String], _id : false,id :false}],
        studentInfo : [{ memberid: String , studInfo : [{studentid : String,courseid: [String] } ] }]
},{ usePushEach: true });

const User = mongoose.model('Profiles', userSchema);
const org = mongoose.model('Orglists',orgSchema);

module.exports = {User,org};