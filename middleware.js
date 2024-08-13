const Campground = require('./models/campground')
const Review = require('./models/review.js')

const {campgroundSchema, reviewSchema} = require('./schema.js')
const ExpressError = require('./utils/ExpressError.js')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated())
        {
            req.flash('error','You must be signed in')
            req.session.returnTo = req.originalUrl
            return res.redirect('/login')
        }
        next()
} 
module.exports.storeReturnTo = (req,res,next)=>{
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.validateCampground = (req,res,next)=>{
    const result = campgroundSchema.validate(req.body)
    if(result.error){
       const msg = result.error.details.map(el => el.message).join(',')
       throw new ExpressError(msg, 400)
    }else{
        next()
    }
}
module.exports.validateReview = (req,res,next)=>{
    const result = reviewSchema.validate(req.body)
    if(result.error){
       const msg = result.error.details.map(el => el.message).join(',')
       throw new ExpressError(msg, 400)
    }else{
        next()
    }
}
module.exports.isAuthor = async (req,res,next)=>{
    const campground = await Campground.findById({_id:req.params.id})
    if(!campground.author.equals(req.user._id)){   
        req.flash('error', 'You dont have permission to do that')
        return res.redirect(`/campground/${campground._id}`)
    }
    next()
}
module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id, ReviewID} = req.params
    const review = await Review.findById(ReviewID)
    const campground = await Campground.findById(id)
    if(!review.author.equals(req.user._id)){   
        req.flash('error', 'You dont have permission to do that')
        return res.redirect(`/campground/${campground._id}`)
    }
    next()
}

