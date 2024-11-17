const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    name: String,
    surname: String,
    location: String,
    
    email: { 
        type: String,
        unique: true
    },

    password: String,

    admin: {
        type: Boolean,
        
    },


    //library system they belong to

    institution: {type: Schema.Types.ObjectId, ref: 'LibrarySystem'}
    

})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel; 