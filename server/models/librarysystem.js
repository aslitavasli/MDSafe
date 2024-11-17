const mongoose = require('mongoose')
const {Schema} = mongoose

const lsSchema = new Schema({

    //All library systems have: 

    //name
    institutionName: {
        type: String,
        required: true,
    }, 

    institutionEmail: {
        type: String,
    }, 

    //library building(s)
    buildings: [{type: Schema.Types.ObjectId, ref: 'LibraryBuilding'}],

    //registered users
    members: [{type: Schema.Types.ObjectId, ref: 'User'}]

})

const lsModel = mongoose.model('LibrarySystem', lsSchema)

module.exports = lsModel;
