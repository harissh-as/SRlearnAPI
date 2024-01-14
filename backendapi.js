require("dotenv").config();

const express = require("express");
var cors = require('cors');
const mongoose = require("mongoose");
const { Int32 } = require("bson");
const axios = require('axios');

var MongoClient = require('mongodb').MongoClient;
mongoose.connect("mongodb+srv://"+process.env.DBUSERNAME+":"+process.env.DBPASSWD+"@cluster0."+process.env.DBURL+".mongodb.net/"+process.env.DBNAME+"?retryWrites=true&w=majority",{useNewUrlParser:true, useUnifiedTopology: true});
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
    console.log("pinging goc enms server");
    axios.get('https://gocenmsapi.onrender.com').then((response) => 
    {
        if(response.data)
        {
			//console.log(response.data);
			console.log("pinged");
        }
    });
});

app.get("/courselist",function(request,response)
{
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

app.get("/register/:usernameentered/:passwordentered/:phonenoentered",function(request,response)
{
	var usernameentry=request.params.usernameentered;
	var passwordentry=request.params.passwordentered;
    var phonenoentry=request.params.phonenoentered;

    var date = new Date();
	var addMinutes = 330;
    date.setTime(date.getTime() + (addMinutes * 60 * 1000));

    const userCollection=new UserCollection(
    {
        _id:Date.now()+"", 
        username:usernameentry, 
		password:passwordentry, 
		phoneno:phonenoentry, 
		status:"apppending", 
    });

    try
    {
        userCollection.save();
        result=[{result:"ok"}];
        response.status(200).json(result);
    }
    catch(error)
    {
        response.status(500).json(error);
    }
    

});

app.listen(process.env.PORT || 3000,function()
{
    console.log("server running at port 3000");
});
