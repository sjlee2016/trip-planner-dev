const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const isGroupAdmin = require("../../middleware/groupAdmin"); 
const Group = require('../../models/Group'); 

const {
    check,
    validationResult
} = require('express-validator/check');


// @route   post /api/groups/request
// @desc    send group join request to admin
// @access  private
router.post('/make', [ auth, 
    [
    check('name', 'name is required')
    .not()
    .isEmpty() 
    ]
], async (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try{
        const user = await User.findById(req.user.id).select('-password'); 
        if(user==null){
            return res.status(404).json({err: "User not authorized"}); 
        }

        const groupFields = {} ;
        groupFields.user =  []; 
        groupFields.admin = [];
        groupFields.name = req.body.name;  
        const group = new Group(groupFields); 
        group.admin.push(req.user.id); 
        group.user.push(req.user.id);
        user.groups.push(group.id); 

        await user.save(); 
        await group.save(); 
        return res.json({msg: 'Group made successfully'}); 

    }catch(err){
        console.log(err);
        return res.status(400).json({err: err.message}); 
    }
}); 


// @route   post /api/groups/request
// @desc    send group join request to admin
// @access  private
router.get('/find/name/:page/:limit', [ auth, 
    [
    check('name', 'name is required')
    .not()
    .isEmpty()
    ]
], async (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try{
         const groups = Group.find({name: req.body.name}, function(err,groups) {
             var groupMap = {};

             groups.forEach(group => {
                 groupMap[group._id] = group;
             }); 
         });  


    }catch(err){
        console.log(err);
        return res.status(400).json({err: err.message}); 
    }
}); 


// @route   post /api/groups/request
// @desc    send group join request to admin
// @access  private
router.post('/request', [ auth, 
    [
    check('groupId', 'group id is required')
    .not()
    .isEmpty(),
    check('email', 'email is required')
    .not()
    .isEmpty() 
    ]
], async (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try{
        const user = await User.findById(req.user.id).select('-password'); 
        if(user==null){
            return res.status(404).json({err: "User not authorized"}); 
        }
        const group = await Group.findOne({_id:req.body.groupId});
        
        if(group == null){
            return res.status(404).json({err: "Group not found"}); 
        }

        if( user.groupRequest.indexOf(req.body.groupId) > -1){
            return res.status(404).json({err: "Group request was already sent"}); 
        }
        
        if(group.requests.indexOf(user.email) > -1){
            return res.status(404).json({err: "User has already joined this group"}); 
        }
        group.requests.push(user.email); 
        user.groupRequest.push(req.body.groupId); 
        await user.save(); 
        await group.save(); 
        return res.json({msg: 'Group request sent successfully'}); 

    }catch(err){
        console.log(err);
        return res.status(400).json({err: err.message}); 
    }
}); 



// @route   post /api/friends/accept
// @desc    accept friend requests received
// @access  private

// @route   post /api/friends/request
// @desc    send friend request to a user
// @access  private
router.post('/accept', [ auth, isGroupAdmin, 
    [
    check('groupId', 'group id is required')
    .not()
    .isEmpty(), 
    check('email')
    .not()
    .isEmpty() 
    ]
], async (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try{
        const user = await User.findOne({email: req.body.email}).select('-password'); 
        const group = await Group.findById(req.body.groupId);
        const groupIndex = group.requests.IndexOf(user.email);
        const userIndex = user.groupRequests.IndexOf(req.body.groupId); 
        if(groupIndex == -1 || userIndex == -1) { 
            return res.status(404).json({msg: 'This request does not exists'});
        }

        group.requests.splice(groupIndex,1);
        user.groupRequests.splice(userIndex,1); 
        group.users.push(user.id);
        user.groups.push(req.body.groupId); 

        return res.json({msg: 'Group join request accepted successfully'}); 

    }catch(err){
        console.log(err);
        return res.status(400).json({err: err.message}); 
    }
}); 


// @route   post /api/groups/admin
// @desc    cancel a friend request
// @access  private
router.post('/cancel', [ auth, isGroupAdmin, 
    [
    check('email', 'email is required')
    .not()
    .isEmpty() 
    ]
], async (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try{
        const user = await User.findOne(req.user.id).select('-password'); 
        const other = await User.findOne({email : req.body.email}); 
        if(user==null || other == null || user.email == req.body.email ){
            return res.status(404).json({err: "Illegal Friend Request"}); 
        }
        const index = user.sentFriendRequest.indexOf(req.body.email);
        const index2 = other.receivedFriendRequest.indexOf(user.email);
        if(index == -1 || index2 == -1 ) {
             return res.status(404).json({err: "Friend request does not exist"}); 
        }
        user.sentFriendRequest.splice(index,1); 
        other.receivedFriendRequest.splice(index2,1); 
        await user.save(); 
        await received.save(); 
        return res.json({msg: 'Friend request canceled successfully'}); 

    }catch(err){
        console.log(err);
        return res.status(400).json({err: err.message}); 
    }
}); 
module.exports = router;