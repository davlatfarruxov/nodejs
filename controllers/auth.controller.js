const User = require('../models/user.model')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const uuid = require('uuid') 



//@desc             Register new user
//@route            POST /api/v1/auth/register
//@auth             Public
exports.register = asyncHandler(async (req, res, next)=>{
    const {name, email, password} = req.body
    const apiKey = uuid.v4()
    const user = await User.create({
        name: name,
        password: password,
        email: email,
        apiKey: apiKey
    })

    const token = user.generateJwtToken()

    res.status(201).json({
        success: true,
        data: user,
        token
    })
    
}) 



//@desc             Login user
//@route            POST /api/v1/auth/login
//@auth             Public
exports.login = asyncHandler(async (req, res, next)=>{
    const {email, password} =req.body


    //Validate email & password
    if(!email || !password){
        return next(new ErrorResponse("Please provide password and email", 400))
    }
    const user = await User.findOne({email:email})

    //Check for the user
    if(!user){
        return next(new ErrorResponse("Invalid Credentials", 401))
    } 

    //Check for passwords
    const isMatch = await user.matchPassword(password)
    if(!isMatch){
        return next(new ErrorResponse('INvalid Credentials', 401))
    }

    const token = user.generateJwtToken()


    res.status(200).json({
        success: true,
        data: user,
        token
    })
})




//@desc             Get profile user
//@route            GET /api/v1/auth/profile
//@auth             Private
exports.getProfile = asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.user._id)

    res.status(200).json({
        success: true,
        data: user
    })

})



//@desc             Update profile
//@route            PUT /api/v1/auth/update
//@auth             Private
exports.updateDetails = asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.user._id)
    const fieldsToUpdate = {
        name: req.body.name || user.name,
        email: req.body.email || user.email
    }    
    const updateUser = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: updateUser
    })

})




//@desc             Update password
//@route            PUT /api/v1/auth/updatepassword
//@auth             Private
exports.updatePassword = asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.user._id)
    
    //Check current password
    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse('Old password is incorrect', 400))
    }

    user.password = req.body.newPassword;
    await user.save()

    const token = user.generateJwtToken()

    res.status(200).json({
        success: true,
        data: user,
        token
    })

})




//@desc             Payment Balance
//@route            PUT /api/v1/auth/paymentbalance
//@auth             Private
exports.balancePayment = asyncHandler(async (req, res, next)=>{
    //CLICK, PAYME
    const user = await User.findById(req.user._id)
    const updatedUser= await User.findByIdAndUpdate(req.user._id, 
        {balance: (user.balance + req.body.payment)},
        {new: true}
    )



    res.status(200).json({
        success: true,
        data: updatedUser
    })

})


//@desc             Activate status
//@route            PUT /api/v1/auth/activate
//@auth             Private
exports.activateProfile = asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.user._id)
    const apiCost = process.env.API_COST
    needMoney = apiCost - user.balance
    if(user.balance < apiCost){
        return next(new ErrorResponse(`Your balance is less than ${apiCost}. You need ${needMoney} more`, 400))
    }
    
    await User.findByIdAndUpdate(req.user._id,
        {balance: (user.balance - apiCost), isActive: true},
        
        {new: true, runValidators: true})

    res.status(200).json({
        success: true,
        message: 'Your profile successfully activated'
    })

})