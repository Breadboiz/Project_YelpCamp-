const express = require('express')
const Router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync.js')
const Campground = require('../models/campground')
const Reviews= require('../controller/review.js')
const {isLoggedIn,validateReview,isAuthor,isReviewAuthor} = require('../middleware.js')


Router.post('/Review',isLoggedIn,validateReview ,catchAsync(Reviews.createReview))
Router.delete('/Review/:ReviewID',isReviewAuthor,isLoggedIn, catchAsync(Reviews.deleteReview))

module.exports = Router