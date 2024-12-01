import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import User from "./models/user.model.js";

const app=express();

app.use(express.json());   
app.use(cors());


mongoose.connect('mongodb+srv://smresponsibilities:Plzv6gPMrxQCwICv@mernclassproject.que7y.mongodb.net/?retryWrites=true&w=majority&appName=MernClassProject').then(()=>{
    console.log("Connected to database");
});



const port=8080;

app.post('/signup', async (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

 
        
  
        const newUser=new User({
            username,
            password
        });

        await newUser.save()
    

    res.status(200).json("User created");
        
    })

    
    
  





app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})



