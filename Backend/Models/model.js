const mongoose = require('mongoose');

const practiseSchema = new mongoose.Schema({
      username: {
            type: String,
            required: true,
            
      },
      password: {
            type: String,
            required: true
      }, 
      projects:{
            type: Array,
            required:true
      },
     
    
}) 

//  Creating a Model from Schema

const practiseModel  = mongoose.model("practiseModel", practiseSchema);
module.exports = practiseModel;