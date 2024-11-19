const mongoose = require('mongoose')
const {Schema} = mongoose

const hospitalSchema = new Schema({

    //All hospital systems have: 

    //name
    institutionName: {
        type: String,
        required: true,
    }, 

    institutionEmail: {
        type: String,
    }, 

    //reports
    reports: [{
        type: Schema.Types.ObjectId, 
        ref: 'Report',
        default: []
    }],

    //registered users
    members: [{
        type: Schema.Types.ObjectId,
         ref: 'User',
         default: []}],
         
    
    //feedback
    feedback: [{
        type: Schema.Types.ObjectId, 
        ref: 'Feedback',
        default: []
    }],

})

const hospitalModel = mongoose.model('HospitalSystem', hospitalSchema)

module.exports = hospitalModel;
