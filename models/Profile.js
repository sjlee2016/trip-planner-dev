const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user' 
    },

    company: {
        type: String 
    }, 

    website : {
        type : String 
    }, 

    location : {
        type : String 
    },

    status : {
        type: String,
        required : true 
    }, 

    skills : {
        type : [String]
    },
    
    experience : [
        {
            title : {
                type : String,
                required : true 
            },
            description : {
                type: String 
            },
            from : {
                type : Date,
                required : true 
            },
            to : {
                type : Date 
            }
        }
    ],
    eduation : [
        {
            school : {
                type: String, 
                required : true 
            },
            year : {
                type : Number,
                required : true 
            }
        }
    ],

    social : { 
        facebook : {
            type : String 
        }, 
        linkedin : {
            type: String,
        },
        instagram : {
            type: String 
        }
    },
    date : {
        type : Date,
        default : Date.now 
    }

})

module.exports = Profile = mongoose.model('profile', ProfileSchema); 