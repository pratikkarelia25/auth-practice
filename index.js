const bcrypt = require('bcrypt')
const express = require('express')
const app = express();
const User = require('./model/user')
const ejs = require('ejs')
const session = require('express-session')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/authDemo', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Mongo connected");
})
.catch((err)=>{
    console.log("ERROR")
    console.log(err)
})
app.use(session({secret:'hehe'}))
app.set('view engine','ejs');
app.set('views','views')
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send('this is the home page')
})


app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    const user = await User.findOne({username:username});
    const validUser = await bcrypt.compare(password, user.password);
    if(validUser){
        req.session.user_id = user._id;
        res.send('WELCOME');
        
    }
    else{
        res.send("TRY AGAIN")
    }
})

app.get('/register',(req,res)=>{
    res.render('register')
})
app.get('/session',(req,res)=>{
    res.send(req.session.user_id)
})
app.post('/register',async(req,res)=>{
    const {username,password} = req.body
    const hash = await bcrypt.hash(password,12)
    const user = new User({
        username,
        password:hash
    })
    req.session.user_id = user._id
    await user.save()
    res.redirect('/')
})

app.get('/secret',(req,res)=>{
    if(!req.session.user_id){
        res.redirect('/')
    }
    res.send("YAY U ARE LOGGED IN")
})


app.listen(3000,()=>{
    console.log("Serving")
})