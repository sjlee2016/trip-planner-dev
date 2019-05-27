const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile'); 
const User = require('../../models/User'); 
const { check, validationResult } = require('express-validator/check');


// @route   get api /profile/me 
// @desc    Fetch My profile
// @access  private
router.get('/me', auth, async (req,res) => {

    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user', 
        ['name', 'avatar']);
        
        if(!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'});
        }

        res.json(profile); 

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
); 

// @route   post api /profile/
// @desc    Create / Update User Profile 
// @access  private
router.post('/', [auth , [
    check('status', 'Status is required')
    .not()
    .isEmpty(),
    check('skills', 'Skills is required')
    .not()
    .isEmpty() 
    
] ] ,
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()}); 
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        skills,
        facebook,
        instagram,
        linkedin
    } = req.body; 

    const profileFields = {} ;
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio; 
    if(status) profileFields.status = status;
    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim()); 
    }

    // Build Social object
    profileFields.social = {} 
    if(facebook) profileFields.social.facebook = facebook;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin; 

    try {
        let profile = await Profile.findOne({ user : req.user.id}); 

        if(profile){
            // Update 
            profile = await Profile.findOneAndUpdate({user: req.user.id}, { $set: profileFields},
            {new: true}
        );
        return res.json(profile); 
        }
        
        // Create 

        profile = new Profile(profileFields); 
        await profile.save();
        return res.json(profile); 
    }catch(err){
        console.error(err.message);
        return res.status(500).json({msg:'Server Error'}); 
    }
    
}
); 

// @route   get api /profile
// @desc    Get all profiles
// @access  public
router.get('/', async(req,res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.send(profiles); 
    }catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server Error'); 
    }
})

// @route   get api /profile/user/user_id
// @desc    Get profile by user ID 
// @access  public
router.get('/user/:user_id', async(req,res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({msg : 'User profile not found'}); 
        }
        res.send(profile); 
    }catch(err)
    {
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg : 'User profile not found'}); 
        }
        console.error(err.message);
        res.status(500).send('Server Error'); 
    }
})


// @route   delete api/profile/
// @desc    delete profile 
// @access  private
router.delete("/", auth, 
async(req,res) => {
    try{
        await Profile.findOneAndRemove({user:req.user.id});

        await User.findOneAndRemove({ _id : req.user.id}); 
        return res.json({msg: 'User deleted'});
    }catch(err){
        console.log(err.message);
        return res.json({msg: 'Server Error'}); ß
    }
});

// @route   put api/profile/experience
// @desc    Add profile experience
// @access  private
router.put('/experience', [auth, [  
    check('title', 'Title is required')
    .not()
    .isEmpty(),
    check('from', 'Title is required')
    .not()
    .isEmpty(),
    check('company', 'Title is required')
    .not()
    .isEmpty()
    ]
]
    , async(req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()}); 
        }

        const {
            title, 
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body; 

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({user: req.user.id}); 
            profile.experience.unshift(newExp);
            await profile.save(); 
            res.json({profile}); 

        }catch(err){
            console.error(err.message);
            return res.status(500).send('Server Error'); 
        }
});

// @route   delete api/profile/experience
// @desc    delete profile experience
// @access  private
router.delete('/experience/:exp_id', auth, 
async(req,res) => {
    try {
        const profile = await Profile.findOne({user:req.user.id}); 

        const removeIndex = profile.experience.map(item => item._id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex,1); 

        await profile.save();

        return res.json(profile); 
    }catch(err){
        console.log({error:err.message});
        return res.status(400).json({errors: errors.array()}); 
   
    }
});



// @route   put api/profile/education 
// @desc    Add profile education
// @access  private
router.put('/education', [auth, [  
    check('school', 'school is required')
    .not()
    .isEmpty(),
    check('year', 'year is required')
    .not()
    .isEmpty()
    ]
]
    , async(req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()}); 
        }

        const {
            school,
            year
        } = req.body; 

        const newEdu = {
           school,
           year
        }

        try {
            const profile = await Profile.findOne({user: req.user.id}); 
            profile.education.unshift(newEdu);
            await profile.save(); 
            res.json({profile}); 

        }catch(err){
            console.error(err.message);
            return res.status(500).send('Server Error'); 
        }
});

// @route   delete api/profile/education
// @desc    delete profile education
// @access  private
router.delete('/education/:edu_id', auth, 
async(req,res) => {
    try {
        const profile = await Profile.findOne({user:req.user.id}); 

        const removeIndex = profile.education.map(item => item._id).indexOf(req.params.exp_id);

        profile.education.splice(removeIndex,1); 

        await profile.save();

        return res.json(profile); 
    }catch(err){
        console.log({error:err.message});
        return res.status(400).json({errors: errors.array()}); 
   
    }
});
module.exports = router; 