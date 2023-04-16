const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
      username: {
            type: String,
            required: true,
            
      },
      projectName: {
            type: String,
            required: true,
      },
      projectData:{
            type: Array,
            required:true
      },

      categories: {
            type: Array,
            required: true
      },
      members:{
            type:Array,
            required:true
      }
     
    
}) 

//  Creating a Model from Schema

const userData  = mongoose.model("userData", projectSchema);
module.exports = userData;