const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');
const User = require('../../models/User');
const Post = require('../../models/Post');
const auth = require('../../middleware/auth');

// @route   post api/post
// @desc    Make post 
// @access  private 
router.post('/', [auth, [
        check('title')
        .not()
        .isEmpty(),
        check('text')
        .not()
        .isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }


        try {
            const user = await User.findById(req.user.id).select('-password');


            const newPost = {
                title: req.body.title,
                text: req.body.text,
                avatar: user.avatar,
                user: req.user.id

            }
            newPost.user = user;

            const post = new Post(newPost);
            await post.save();
            return res.json(newPost);
        } catch (err) {
            console.log(err.message);
            return res.status(400).json({
               msg: 'Server Error'
            });
        }

    });


// @route   get api/post/
// @desc    Get all posts
// @access  public
router.get('/',
    async (req, res) => {
        try {
            const limit = req.body.limit;
            const page = req.body.page; 
            if(!limit  || !page){
            const posts = await Post.find().sort({date:-1}).skip(Number(limit) * Number(page)).limit(Number(limit)); 
            return res.json(posts);    
            }
            const posts = await Post.find().sort({date:-1}); 
            return res.json(posts);
        } catch (err) {
            console.log(err.message);
            return res.status(400).json({msg:'Failed to get posts'}); 
        }
    }
);

// @route   gett api/post/:post_id
// @desc    Get a single post 
// @access  public
router.get('post/:post_id',
    async (req, res) => {
        try {
            const post = await Post.findById({_id: req.params.post_id }); 
            if(!post){
                return res.status(400).json('Post not found');
            }
            return res.json(post);
        } catch (err) {
            console.log(err.message);
            return res.status(400).json({msg:'Failed to get posts'}); 
        }
    }
);


// @route   post api/posts/user/:name
// @desc    Get posts by a user
// @access  public
router.get('/user/:name',
    async (req, res) => {
        try {
            const user = await User.findOne({name: req.params.name}).select('-password'); 
           
            if(!user)
            {
                return res.status(400).json('User not found'); 
            }            const posts = await Post.find({user: user.id}); 
           
            if(!posts){
                return res.status(400).json('Post not found');
            }
            return res.json(posts);
        } catch (err) {
            console.log(err.message);
            return res.status(400).json({msg:'Failed to get posts'}); 
        }
    }
);


module.exports = router;