const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    image:[
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author:{
         type: Schema.Types.ObjectId,
        ref: 'User'
    } ,
    Review:[{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})
campgroundSchema.post('findOneAndDelete',async(campground)=>{
    console.log("---------DELETED--------")
    await Review.deleteMany({_id:{$in: campground.Review}})    
})
module.exports = mongoose.model('Campground', campgroundSchema)