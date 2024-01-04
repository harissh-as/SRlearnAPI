require("dotenv").config();

const express = require("express");
var cors = require('cors');
const mongoose = require("mongoose");
const { Int32 } = require("bson");

var MongoClient = require('mongodb').MongoClient;
mongoose.connect("mongodb+srv://"+process.env.DBUSERNAME+":"+process.env.DBPASSWD+"@cluster0.d3rjzrq.mongodb.net/"+process.env.DBNAME+"?retryWrites=true&w=majority",{useNewUrlParser:true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema(
    {
		_id:{type:String}, 
        username:{type:String}, 
		password:{type:String}, 
		phoneno:{type:String}, 
		status:{type:String}, 
    });    
const UserCollection=mongoose.model("users",userSchema);

const courseSchema = new mongoose.Schema(
    {
		_id:{type:String}, 
        coursename:{type:String}, 
		videolink:{type:String}, 
		description:{type:String}, 
    });

const CourseCollection=mongoose.model("courses",courseSchema);


const app = express();


console.log("end of script");

app.use(cors())
app.get("/",function(request,response)
{
    console.log("get request recieved");

    CourseCollection.find().then((result)=>
    {
        response.status(200).json(result);
    }).catch((error)=>
    {
        response.status(500).json(error)    
    });
});

app.get("/login/now/:usernameentered/:passwordentered",function(request,response)
{
	var usernameentry=request.params.usernameentered;
	var passwordentry=request.params.passwordentered;
	var queryfind = {};
	queryfind["username"] = usernameentry;
	queryfind["password"] = passwordentry;

    UserCollection.find(queryfind).then((result)=>
    {
        response.status(200).json(result);
    }).catch((error)=>
    {
        response.status(500).json(error)    
    }); 

});

app.listen(process.env.PORT || 3000,function()
{
    console.log("server running at port 3000");
});