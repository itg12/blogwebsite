const mongoose = require('mongoose')
const User = require('./UserSchema.js')

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    desc:{
        type: String,
        required:true
    },
    tag:{
        type: String,
        required:true
    },
    category:{
        type: String,
        required:true
    },
    image:{
        type: String,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:User
    }

}, {timestamps:true})



const Blogs = mongoose.model('blogs', blogSchema);   // Here are two parameter collection name and schema name;

module.exports = Blogs;  // We are exporting it because we use this file on multiple places.

