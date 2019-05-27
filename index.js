const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000; 

const connectDB = require('./config/db'); 

// Connect Database 
connectDB(); 

app.use(express.json({extended: false})); 

app.get('/', (req,res) => {
    res.send('API running');
}); 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Define Routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));



app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 
