const User = require('../models/user.js')

module.exports.renderRegisterForm = (req,res)=>{
    res.render('register.ejs',{title: "Register"})
}
module.exports.registerNewUser = (async(req,res,next)=>{
    try{
        const {email, username, password} = req.body.user
        const newUser = new User({email,username})
        // console.log(req.body.user)
        const RegisterUser = await User.register(newUser, password)
        req.logIn(RegisterUser,(err)=>{
            if(err) return next(err)
            req.flash('success',"Welcome to the Yelcamp!")
            res.redirect('/campground')
        })
    }
    catch(e){
        console.log('----------------------------------')
        console.log(e)
        if(Object.hasOwn(e,'errorResponse')) {
            if(Object.hasOwn(e.errorResponse,'code')){
                e.message = "Email is already registered"
            }
        }
         req.flash('error', e.message)
         res.redirect('/register')
    }
})

module.exports.renderLoginForm =  (req,res)=>{
    res.render('login.ejs',{title:"Login"})
}

module.exports.Login = (req,res)=>{
    const redirectUrl = res.locals.returnTo || '/campground'
    req.flash('success', "Welcome to Yelpcamp")
    res.redirect(redirectUrl);
}
module.exports.Logout = async(req,res,next)=>{
    const redirectUrl = res.locals.returnTo || '/campground'
    console.log(redirectUrl)
    req.flash('success', "Loged out")
    req.logOut((err)=>{
        if(err) return next(err)
    })
  //  req.session.passport = null
  res.redirect(redirectUrl);

}