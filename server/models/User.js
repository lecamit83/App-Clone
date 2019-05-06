const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username : {
        type: String, 
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required: true,
        trim : true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid!");
            }
            if(User.find({email : value})){
                throw new Error("Email is duplicated!");
            }
            
        }
    }, 
    password : {
        type : String,
        required : true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error("Password cannot contain 'password'")
            }
            if(value.toLowerCase().includes(' ')) {
                throw new Error("Password cannot contain 'space'")
            }
            if(!validator.isLength(value, {min : 6 , max : 30})) {
                throw new Error("Password length must between 6 to 30")
            }
        }
    }
}, {
    timestamps: true
});


userSchema.methods.toJSON = function () {
    const user = this;

    const objectUser = user.toObject();

    delete objectUser.password;
    delete objectUser.tokens;

    return objectUser;
}

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;