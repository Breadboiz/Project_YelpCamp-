const Joi = require('joi')

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object(
        {
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: [
            {
                url: Joi.string().required(),
                filename: Joi.string().required()

            }
        ],
        location: Joi.string().required(),
        description: Joi.string().required()
        }
    ).required(),
    removeImg: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    Review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    }).required()
})


module.exports.userSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required()
    }).required()
})
//create conflict
