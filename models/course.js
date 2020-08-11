const mongoose = require('mongoose');

// const topicSchema = mongoose.Schema({
//     "topicno": Number,
//     "topic name": String,
//     "subtopics": [{
//         "subtopic no": Number,
//         "subtopic name": String,
//         "youtubelink": String
//     }]
// })

const courseSchema = mongoose.Schema({
    "courseName": String,
    "category": String,
    "shortdescription": String,
    "longdescription": String,
    "coursethumbnail":  String,
    "instructorname": String,
    "syllabusUniversity": String,
    "courseCreatedDate": Date,
    "courseUpdatedDate": Date,
    "organizationname": String,
    "organizationlogo": String,
    "instructorprofilepic": String,
    "instructorid":String,
    "organizationid":String,
    "topics": [{
        "topicno": Number,
        "topic name": String,
        "youtubelink": String,
        "subtopics": [{
            "subtopic no": Number,
            "subtopic name": String,
            "youtubelink": String,
            _id: false,
            id: false
        }],
        _id: false,
        id: false
    }],
    "unused_videos" : [ { filename : String, path : String ,_id : false}],
    "blockProfile": [String]
});

courseSchema.virtual('id').get(function(){
    return this._id;
});
module.exports = mongoose.model('Course', courseSchema);