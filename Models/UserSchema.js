const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    image:{
        type:String,
        default:""
    },
    name: {
        type: String,
        required: true       
    },

    email: {
        type: String,
        required: true,
        unique:true
    },

    password: {
        type: String,
        required: true
    },

    favourites: [],

    creations:[]

}, {timestamps:true})



const User = mongoose.model('users', userSchema);   // Here are two parameter collection name and schema name;

module.exports = User;  // We are exporting it because we use this file on multiple places.

