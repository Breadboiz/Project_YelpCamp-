const Review = require('../models/review.js')
const Campground = require('../models/campground')

module.exports.createReview = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findOne({_id: req.params.id})
    const newReview = new Review(req.body.Review)
    newReview.author = req.user._id
    campground.Review.push(newReview)
    await newReview.save()
    await campground.save()
   // console.log(req.body)
    //res.send(newReview) 
    res.redirect(`/campground/${id}`)
    req.flash('success','Review added')
}
module.exports.deleteReview = async(req,res)=>{
    const {id, ReviewID} = req.params
    await Campground.findByIdAndUpdate(id, {$pull:{Review: ReviewID}})
    await Review.findByIdAndDelete(ReviewID)
    req.flash('success','Review deleted')
    res.redirect(`/campground/${id}`)
}