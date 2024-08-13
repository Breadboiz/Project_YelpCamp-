const express = require('express')
const Router = express.Router()
const catchAsync = require('../utils/catchAsync.js')
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware.js')
// const Review = require('../models/review.js')
const Campgrounds = require('../controller/campground.js')
const multer = require('multer')
const {storage} = require('../cloudinary/index.js')
const upload = multer({storage:storage})

Router.get('/new',isLoggedIn, Campgrounds.renderNewForm)
Router.get('/:id/edit', isLoggedIn,catchAsync(Campgrounds.renderEditForm))

Router.route('/')
.get(catchAsync(Campgrounds.index))
.post(isLoggedIn,upload.array('campground[image]'),validateCampground,catchAsync(Campgrounds.createNewCampground))


Router.route('/:id')
.get( catchAsync(Campgrounds.renderDetailsPage))
.put(isLoggedIn,isAuthor,upload.array('campground[image]'),validateCampground,catchAsync(Campgrounds.editCampground))
.delete(isLoggedIn,isAuthor,catchAsync(Campgrounds.deleteCampground))

module.exports = Router