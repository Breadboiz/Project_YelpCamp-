const express = require('express')
const Router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync.js')
const Campground = require('../models/campground')
const Reviews= require('../controller/review.js')
const {isLoggedIn,validateReview,isAuthor,isReviewAuthor} = require('../middleware.js')


Router.route('/Review').post(isLoggedIn,validateReview ,catchAsync(Reviews.createReview))
Router.route('/Review/:ReviewID').delete(isReviewAuthor,isLoggedIn, catchAsync(Reviews.deleteReview))

module.exports = Router