if(process.env.NODE_ENV !== 'production')
    {
        require('dotenv').config()
    }

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOveride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user.js')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db = mongoose.connection

db.on("error", console.error.bind(console, "Connection error"))
db.once("open", ()=>{
    console.log("Database connected")
})

const sessionConfig = {
    secret: "shhhh!!!!keepyoursecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        //expires: Date().now + 100000,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
app.use(session(sessionConfig))
app.use(express.static(path.join(__dirname,'public')))
app.engine('ejs', ejsMate)
app.set('views engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
app.use(methodOveride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
  // console.log(req.user)
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})
app.get('/', (req,res)=>{
    res.redirect('/campground')
})

//Camground route
const campgroundRoutes = require('./routes/campgrounds.js')
app.use('/campground', campgroundRoutes)
//Review route
const ReviewRoutes = require('./routes/review.js')
app.use('/campground/:id', ReviewRoutes)
//user routes
const UserRoutes = require('./routes/user.js')
const { error } = require('console')
app.use('/', UserRoutes)
//Handle error route
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found', 404))
 })

app.use((err,req,res,next)=>{
    console.log(err)
     const {statusCode = 500, message = 'Some thing went wrong'} = err
     res.status(statusCode).render('error.ejs', {err,title: err.message})
})

app.listen(4000, ()=>{
    console.log('Server is running on port 4000')
})


