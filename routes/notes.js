const express = require ('express');
// eslint-disable-next-line
const { model } = require('mongoose');
const router = express.Router();

router.get('/',(req,res)=>{
    
    res.json([])
     
})
module.exports = router


