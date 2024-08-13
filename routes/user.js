const express = require('express')
const Router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync.js')
const {campgroundSchema, reviewSchema, userSchema} = require('../schema.js')
const passport = require('passport')
const {storeReturnTo, isLoggedIn} = require('../middleware.js')
const Users = require('../controller/user.js')

Router.route('/register').get(Users.renderRegisterForm).post(Users.registerNewUser)
Router.route('/login').get(Users.renderLoginForm).post(storeReturnTo,passport.authenticate('local',{failureFlash:{message: "Username or password is incorrect"}, failureRedirect:'/login'}), Users.Login)


Router.get('/logout',storeReturnTo , Users.Logout)
module.exports = Router


