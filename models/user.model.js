const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const usereSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            'Please enter valid email address',
        ]
    },
    password:{
        type: String,
        required: true,
        minLength: 6
    },
    adminStatus: {
        type: Boolean,
        default: false
    },
    apiKey: {
        type: String,
        unique: true,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})


//Hashing password with bcrypt
usereSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt) 
})


// Generate jwt Token
usereSchema.methods.generateJwtToken = function () {
    return jwt.sign({id: this._id, email: this.email}, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRE 
    })
}









//Check user entered password with hashed password
usereSchema.methods.matchPassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
}


module.exports = mongoose.model('User', usereSchema)