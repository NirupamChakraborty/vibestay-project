const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongooseEmail = require("passport-local-mongoose");

const userSchema = new Schema({
    //  username will be already be created by the passport local mongoose 
    email:{
        type: String,
        required: true,
    }
});


userSchema.plugin(passportLocalMongooseEmail);

module.exports = mongoose.model('User', userSchema);