const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
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
    }, 
    password : {
        type : String,
        required : true,
    },
    tokens : [{
        token : {
            type : String,
            require : true
        }
    }]
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

userSchema.methods.generateAuthenticationToken = async function () {
    const user = this;
   
    const token = await jwt.sign({_id : user._id.toString()} , process.env.SECRET, {expiresIn : '7 days'});

    
    user.tokens = user.tokens.concat({ token });

    await user.save();

    return token;
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