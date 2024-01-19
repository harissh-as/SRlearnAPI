       require("dotenv").config();

const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const { Int32 } = require("bson");
const axios = require('axios');

const MongoClient = require('mongodb').MongoClient;
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

app.get("/userlist",function(request,response)
{
    UserCollection.find().then((result)=>
    {
        response.status(200).json(result);
    }).catch((error)=>
    {
        response.status(500).json(error)    
    });
});

app.get("/login/now/:usernameentered/:passwordentered",function(request,response)
{
	let usernameentry=request.params.usernameentered;
	let passwordentry=request.params.passwordentered;
	let queryfind = {};
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
	let usernameentry=request.params.usernameentered;
	let passwordentry=request.params.passwordentered;
    	let phonenoentry=request.params.phonenoentered;

    let date = new Date();
    let addMinutes = 330;
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

app.get("/createuser/:usernameentered/:passwordentered/:phonenoentered/:statusentered",function(request,response)
{
	let usernameentry=request.params.usernameentered;
	let passwordentry=request.params.passwordentered;
        let phonenoentry=request.params.phonenoentered;
	let statusentry=request.params.statusentered;

    let date = new Date();
    let addMinutes = 330;
    date.setTime(date.getTime() + (addMinutes * 60 * 1000));

    const userCollection=new UserCollection(
    {
        _id:Date.now()+"", 
        username:usernameentry, 
	password:passwordentry, 
	phoneno:phonenoentry, 
	status:statusentry, 
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

app.get("/createcourse/:coursenameentered/:videolinkentered/:descentered",function(request,response)
{
	let coursenameentry=request.params.coursenameentered;
	let videolinkentry=request.params.videolinkentered;
        let descentry=request.params.descentered;

    let date = new Date();
    let addMinutes = 330;
    date.setTime(date.getTime() + (addMinutes * 60 * 1000));

    const courseCollection=new CourseCollection(
    {
	_id:Date.now()+"", 
        coursename:coursenameentry, 
	videolink:videolinkentry, 
	description:descentry, 
    });

    try
    {
        courseCollection.save();
        result=[{result:"ok"}];
        response.status(200).json(result);
    }
    catch(error)
    {
        response.status(500).json(error);
    }
});

app.get("/updatecourse/:courseidentered/:coursenameentered/:videolinkentered/:descentered",function(request,response)
{
	let courseidentry=request.params.courseidentered;
	let coursenameentry=request.params.coursenameentered;
	let videolinkentry=request.params.videolinkentered;
        let descentry=request.params.descentered;
	
    CourseCollection.findByIdAndUpdate(courseidentry, {coursename:coursenameentry, videolink:videolinkentry, description:descentry}, { new: true  }).then((result)=>
    {
        response.status(200).json(result);
    }).catch((error)=>
    {
        response.status(500).json(error)    
    });


});

app.get("/updateuser/:useridentered/:usernameentered/:passwordentered/:phonenoentered/:statusentered",function(request,response)
{
	let useridentry=request.params.useridentered;
	let usernameentry=request.params.usernameentered;
	let passwordentry=request.params.passwordentered;
    	let phonenoentry=request.params.phonenoentered;
	let statusentry=request.params.statusentered;

    UserCollection.findByIdAndUpdate(useridentry, {username: usernameentry, password: passwordentry, phoneno: phonenoentry, status: statusentry}, { new: true  }).then((result)=>
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
