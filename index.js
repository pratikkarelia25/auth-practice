const bcrypt = require('bcrypt')
const express = require('express')
const app = express();
const User = require('./model/user')
const ejs = require('ejs')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/authDemo', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Mongo connected");
})
.catch((err)=>{
    console.log("ERROR")
    console.log(err)
})

app.set('view engine','ejs');
app.set('views','views')
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send('this is the home page')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    const validUser = await User.findOne({username});
    const user = await bcrypt.compare(password, validUser.password)
    if(!user){
        res.send('TRY AGAIN')
    }
    res.send("WELCOME")
    
})

app.post('/register',async(req,res)=>{
    const {username,password} = req.body
    const hash = await bcrypt.hash(password,12)
    const user = new User({
        username,
        password:hash
    })
    await user.save()
    res.redirect('/')
})

app.get('/secret',(req,res)=>{
    res.send("YOU CANNOT SEE ME UNTIL U LOGGED IN")
})

app.listen(3000,()=>{
    console.log("Serving")
})