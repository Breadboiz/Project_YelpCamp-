const mongoose = require('mongoose')
const Schema = mongoose.Schema 
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email:{
        type: String,
        required:[true],
        unique: [true, 'That email address has already been used']
    }
})
UserSchema.plugin(passportLocalMongoose,{
    
    //   selectFields : 'email username password' //Space seperate the required fields
    
});
module.exports = mongoose.model('User', UserSchema)

