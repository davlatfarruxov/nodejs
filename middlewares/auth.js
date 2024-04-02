const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/user.model')


//Proteting routes
exports.protected = asyncHandler(async (req, res, next) =>{
    let token

    //Authorization <type> <credeentials> Bearer jdsakjdnasj.asdasas.asdasd
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        return next(new ErrorResponse('Not authorized to access this route'), 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET)

    req.user = await User.findById(decoded.id)

    next()
})

//  Grand access to admins
exports.adminAccess = (req, res, next)=>{
    if(!req.user.adminStatus){
        return next(new ErrorResponse('This rouye can be access only admin status users', 403))
    }
    next()
}



//  API key access
exports.apiKeyAccess = asyncHandler(async(req, res, next)=>{
    let key
    //  Check header for api key
    if(req.headers["apikey"]){
        key=req.headers["apikey"]
    }
    if(!key){
        return next(new ErrorResponse('No API Key to access this route', 403))
    }

    const user = await User.findOne({apiKey: key})

    //check if user exist
    if(!user){
        return next(new ErrorResponse('No user found by this API Key', 400))
    }

    //  Check is user status active
    if(!user.isActive){
        return next(new ErrorResponse('Please activate your status to get response', 403))
    }
    next()
})
