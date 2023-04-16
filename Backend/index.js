const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose  = require("mongoose");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require("dotenv").config();
// connect to database

mongoose.connect(process.env.CONNECTION, {useNewUrlParser: true,
useUnifiedTopology: true}).then((res)=> console.log("connect to the database"));

//  importing the model

const practiseModel = require("./Models/model");
const userData = require("./Models/projects");

// importing accessToken function

const {createTokens, validateToken} = require("./JWT/jwt");
const { validate } = require("./Models/model");

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Making requests

app.post("/post", async (req, res) => {
      let userName = req.body.username;
      let userPassword = req.body.password;
      let projects = req.body.projects;
      let projectName = req.body.projectName;
      let categories = req.body.categories;
      let projectData = req.body.projectData;
    
      const exist = await practiseModel.find({username: userName}).count();
      if (exist) {
        return res.json({ message: "user exist" }); // return the response here
      } else {
        // hash the password
    
        bcrypt.hash(userPassword, 10).then((hashed) => {
          const newUser = new practiseModel({
            username: userName,
            password: hashed,
            projects: projects,
          });
    
          try {
            newUser.save().then((data) => {
              const pd = new userData({
                username: userName,
                projectName: projectName,
                projectData: projectData,
                categories: categories,
                members: [],
              });
    
              pd.save().then((data) => {
                res.json(data); // send the response here
              });
            });
          } catch (err) {
            res.status(500).json({ message: err });
          }
        });
      }
    });
    

app.get("/login", async (req, res)=>{

      var loginUsername = req.query.username;
      
      let loginPassword = req.query.password;
      
      let data  = await practiseModel.find({username: loginUsername});
      

      
      if(data.length == 0){
            return res.status(500).json({error: "user does not exist"});
      }
      else{
            let data2 = await userData.find({$or:[{username: loginUsername}, {members:loginUsername}]});
            const dbPassword = data[0].password;
            let matched = await bcrypt.compare(loginPassword, dbPassword);
            
            if(!matched){
                  return res.status(400).json({error: "username or password does not match"});
            }
            else{
                  const accessToken = createTokens(data);
                  res.cookie("accessToken", accessToken, {
                        maxAge: 60*60*24*30*1000,
                        httpOnly:true
                  })
                  const result = {
                        data: data2
                  }
                  console.log(result)
                  return res.send(result);
                        
            }
            
      }
})


app.patch("/addCategory", async (req, res)=>{
      let username =req.body.username;
      let categories =req.body.categories;

      let data  = await userData.updateOne({ username: username }, 
      {
        $set: 
          {
            categories: categories
          }
      });

      console.log(data);
})
app.put("/addTodo", async (req, res)=>{
      let username =req.body.username;
      let todos = req.body.todos;
      let name = req.body.projectName;
      let categories = req.body.categories;
      let data  = await userData.updateOne({$or:[{ username: username},{members:username}], projectName:name }, 
      {
        $set: 
          {
            projectData: todos,
            categories: categories
          }
      });

      console.log(data);
})

app.get("/projectData", async (req, res)=>{

     console.log(req.query)

      let data  = await userData.findOne({ projectName: req.query.projectName });
      console.log(data);
      res.send(data);
      
})

app.patch("/modifyUserData", async (req, res)=>{
      let username = req.body.username;
      let projectName  = req.body.projectName;
      console.log(req.body);

      let data = await practiseModel.updateOne({ username: username }, 
            {
              $push: {
                  "projects": projectName
                }
                
            });
})

app.post("/submitData", async (req, res)=>{
      let username = req.body.username;
      let projectName  = req.body.projectName;
      let projectData  = req.body.projectData;
      let categories  = req.body.categories;
      console.log(req.body);

      const pd = new userData({username: username, projectName:projectName, projectData:projectData, categories: categories, members:[]});
      
            try{
                  pd.save().then((data)=> res.json(data));
            }catch(err){
                  res.status(500).json({message: err})
            }
})

app.get("/updateUserData", async(req, res)=>{
      let data  = await practiseModel.find({ username: req.query.username });
      console.log(data);
      res.send(data);
})

app.delete("/deleteProject",async (req,res)=>{
      let username = req.query.username;
      let projectName = req.query.projectName
      let data = await userData.deleteOne({username: `${username}`, projectName: `${projectName}`});    
      res.send(data);
})
app.patch("/removeProject",async (req,res)=>{
      let username = req.body.username;
      let projectName = req.body.projectName
      console.log(req.body);
      console.log("trying to delete" + projectName);
      await practiseModel.updateOne({username: username},  {$pull : {projects : projectName}});    
      
})

app.patch("/addMember", async (req, res)=>{
      let memberName = req.body.memberName;
      let projectName = req.body.projectName;
      let username = req.body.username;
      let data = await practiseModel.findOne({username: memberName});
      if(data){
            let data2 = await userData.updateOne({username: username, projectName: projectName}, {$push :{
                  members: memberName
            }});
            res.send(data2);
      }
      else{
            // res.status("500").json({message: "user does not exist"});
            res.json("user does not exist")
      }
})
app.patch("/removeMember", async (req, res)=>{
      let memberName = req.body.memberName;
      let projectName = req.body.projectName;
      let username = req.body.username;

      let data = await practiseModel.findOne({members: memberName});
      if(data){
            await userData.updateOne({username: username, projectName: projectName}, {$pull :{
                  members: memberName
            }});         
      }
      else{
            res.json("user does not exist")
      }
})
app.listen(process.env.PORT , ()=>{
      console.log("port running on port number 3001");
})
