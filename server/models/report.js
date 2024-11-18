const mongoose = require('mongoose')
const {Schema} = mongoose

const reportSchema = new Schema({
    //level of report
    level: Number,
        //where it occured
    location: String,

    //Which user they belong to
    user: {type: Schema.Types.ObjectId, ref: 'User'},

    //date it occured
    createdAt: {
        type: Date,
        default: Date.now
    }
   
    

})

const reportModel = mongoose.model('Report', reportSchema)

module.exports = reportModel; 