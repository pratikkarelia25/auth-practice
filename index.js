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
const requireLogin = (req,res,next)=>{
    if(!req.session.user_id){
        return res.redirect('/login')
    }
    next();
}

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    const foundUser = await User.findAndValidate(username,password)
    if(foundUser){
        req.session.user_id = foundUser._id;
        res.render('logout');
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
    const user = new User({
        username,
        password:hash
    })
    req.session.user_id = user._id
    await user.save()
    res.redirect('/')
})

app.post('/logout',(req,res)=>{
    req.session.user_id=null;
    res.render('login')
})

app.get('/secret',requireLogin,(req,res)=>{
    res.render("secret")
})


app.listen(3000,()=>{
    console.log("Serving")
})