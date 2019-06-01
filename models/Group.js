const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    'user': [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }] ,
    'name' : {
        type : String,
        required : true 
    }  ,
    'admin': [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }]

})

module.exports = Group = mongoose.model('group', groupSchema); 

