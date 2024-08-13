const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ReviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
    author:
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        } 
    
})

Review = mongoose.model("Review", ReviewSchema)
module.exports = Review