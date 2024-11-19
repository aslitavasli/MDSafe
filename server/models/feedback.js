const mongoose = require('mongoose')
const {Schema} = mongoose

const feedbackSchema = new Schema({
    //title
    title: String,
        //where it occured
    body: String,

    //Which user they belong to
    user: {type: Schema.Types.ObjectId, ref: 'User'},

    //date it occured
    createdAt: {
        type: Date,
        default: Date.now
    },
   
    isAnonymous: Boolean

    // isSentToMedSafe: Boolean
    

})

const feedbackModel = mongoose.model('Feedback', feedbackSchema)

module.exports = feedbackModel; 