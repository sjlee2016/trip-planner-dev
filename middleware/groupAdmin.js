const express = require('express');
const User = require('../models/User');
const Group = require('../models/Group'); 
module.exports = function(req,res,next){

    // verify 
    try {
        const group = Group.findById(req.body.groupId); 
        if(group==null){
            return res.status(401).json({msg: 'group not found'}); 
        }
        if(group.admin.indexOf(req.user.mail) == -1 ){
            return res.statu(404).json({msg:'not admin'});
        } 
        next(); 
    }catch(err){
        return res.status(401).json({msg: 'not admin'}); 
    }
}