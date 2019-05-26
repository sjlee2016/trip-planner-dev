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


// @route   delete api/post/:post_id
// @desc    delete a post 
// @access  private
router.delete('/:post_id', auth, 
async(req,res) => {
    try {
        const post = await Post.findOne({_id : req.params.post_id});
        if(!post){
            return res.status(404).json({msg: 'post not found'}); 
        }
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        }
        await post.remove(); 
        res.json({msg: 'Post removed'});
    }catch(err){
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'post not found'}); 
        }
        res.status(400).json({msg: 'Server Error'});
    }
}); 
// @route   gett api/post/:post_id
// @desc    Get a single post 
// @access  public
router.get('post/:post_id',
    async (req, res) => {
        try {
            const post = await Post.findById({_id: req.params.post_id }); 
            if(!post){
                return res.status(404).json('Post not found');
            }
            return res.json(post);
        } catch (err) {
            console.log(err.message);
            return res.status(404).json({msg:'Failed to get posts'}); 
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



// @route   post api/posts/like/:id
// @desc    like a post
// @access  private
router.put('/like/:id', auth, 
    async (req, res) => {
        try {
            const post = Post.findById({id: req.params.id});
            if(!post){
                return res.status(404).json({msg: 'post not found'}); 
            }
            if(post.likes.filter(like => like.user.toString() == req.user.id).length > 0){
                return res.status(400).json({msg: 'Post already liked'}); 
            }
            post.likes.unshift({user: req.user.id}); 
            post.save(); 
        } catch (err) {
            console.log(err.message);
            return res.status(400).json({msg:'Server Error'}); 
        }
    }
);


// @route   post api/posts/like/:id
// @desc    unlike a post
// @access  private
router.put('/unlike/:id', auth, 
    async (req, res) => {
        try {
            const post = Post.findById({id: req.params.id});
            if(!post){
                return res.status(404).json({msg: 'post not found'}); 
            }
            if(post.likes.filter(like => like.user.toString() == req.user.id).length == 0){
                return res.status(400).json({msg: 'Post has not yet been liked'}); 
            }
            const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id); 

            post.likes.splice(removeIndex);

            post.save(); 
            
        } catch (err) {
            console.log(err.message);
            return res.status(400).json({msg:'Server Error'}); 
        }
    }
);

module.exports = router;