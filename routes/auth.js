/* eslint-disable no-undef */
const express = require ('express');
// eslint-disable-next-line no-unused-vars
const User =require('../models/User')

// eslint-disable-next-line
const { model } = require('mongoose');
const router = express.Router();
// eslint-disable-next-line no-unused-vars
const {body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET ='Harryisagoodb$oy';
//Create a User using:POST "/api/auth/createuser".No login required   
router.post('/CreateUser',[
body('name','Enter a valid name').isLength({min:5}),
body('email','Enter a valid email').isEmail(),
body('password','Password must be at least 5 characters').isLength({min:5})],
 async (req,res)=>{
    //if there are errors ,return bad request and the errors
    
    const errors =validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //Check whether the user with this email exits already
    try{
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({errors:"Sorry a user with this email already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass =await bcrypt.hash(req.body.password,salt)
    //Create a new User
     user =await User.create({
        name: req.body.name,
        password:secPass,
        email: req.body.email,
    });
    const data = {
        user:{
            id:user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);

   
       res.json({authtoken});
       //catch errors
    }catch(error){
     console.error(error.message); 
     res.status(500).send("Internal Server Error");  
    }
})

//Authenticate a User using:POST "/api/auth/login".No login required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','password cannot be blank').exists(),
     async (req,res)=>{
    //if there are errors ,return bad request and the errors
    const errors =validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email,password}= req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors:"please try to login with correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({errors:"please try to login with correct credentials"});
        }
        
        const data = {
            user:{
                id:user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
    
       res.json({authtoken});
    }catch(error){
     console.error(error.message); 
     res.status(500).send("Internal Server Error");  
    }
     }])
module.exports = router