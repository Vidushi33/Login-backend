require('dotenv').config()
const express = require("express");
const userModel = require("./database/user");

const app = express();
app.use(express.json());
const cors = require("cors");
app.options('*', cors())

app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const mongoose = require("mongoose");
const UserModel = require('./database/user');
// var mongoDB = process.env.MONGODB_URI;
mongoose.connect('mongodb+srv://vidushimalik33:r7qSZkwcKvo01Omj@cluster0.lvrnv.mongodb.net/login-database?retryWrites=true&w=majority' , { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("CONNECTION ESTABLISHED")).catch(err => console.log(err));

// opening of page
app.get("/" , (req, res) => {
    return res.json({"Welcome" : `to the backend software for the Login Form`});
});

// POST REQUEST 
app.post("/register", async(req, res) => {
    // console.log(req.body);
    
    const newUser = await userModel.create(req.body);
    console.log(newUser);
    const token = newUser.generateJwtToken();
    return res.json({
        userAdded: newUser,
        tokens : token,
        message : "Registration Successful!!!"
    });
   
})

app.post('/login',async(req,res)=>{
    try{
       const check= await userModel.findByEmailAndPassword(req.body);

        if(check==1){
            return res.status(200).json({message:"Incorrect Password",icon:"warning"})
        }
        else if(check==0){
            return res.status(200).json({message:"Account not found, Kindly Sign Up",icon:"warning"})
        }
        else{
            const token=check.generateJwtToken();
            return res.status(200).json({token,status:"success",message:"Successfully Logged In!",icon:"success",userDetails:check})
        }
    }
    catch(err){
        return res.status(500).json({error : err})
    }
})

app.listen(process.env.PORT || 5000,()=>{
    console.log("MY EXPRESS APP IS RUNNING")
})