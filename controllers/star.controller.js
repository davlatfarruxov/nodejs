const Star = require('../models/star.model')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')



//@desc             Get all stars
//@route            Get /api/v1/star
//@auth             Public / with apiKey
exports.getAllStars =  asyncHandler(async (req, res, next)=>{
    const pageLimit = process.env.DEFAULT_PAGE_LIMIT || 5
    const limit = parseInt(req.query.limit) || pageLimit
    const page = parseInt(req.query.page) || 1
    const total = await Star.countDocuments()
    const stars = await Star
    .find()
    .skip((page*limit)-limit)
    .limit(limit)

    res.status(200).json({
        success: true,
        pageCount: Math.ceil(total/limit),
        currentPage: page,
        nextpage: Math.ceil(total/limit) < page+1 ? null : page+1,
        data: stars
    })
})



//@desc             Creat new star
//@route            POST /api/v1/star
//@auth             Private/Admin
exports.createNewStar =  asyncHandler(async (req, res, next)=>{
    const newStar = await Star.create({
        name: req.body.name,
        temprature: req.body.temprature,
        massa: req.body.massa,
        diametr: req.body.diametr,
        image: 'uploads/' + req.file.filename 
    })

    res.status(200).json({
        success: true,
        data: newStar
    })
})



//@desc             Get star by id
//@route            Get /api/v1/stars/:id
//@auth             Public / with apiKey
exports.getStarById =  asyncHandler(async (req, res, next)=>{
    const star = await Star.findById(req.params.id)

    res.status(200).json({
        success: true,
        data: star
    })
})



//@desc             Update star 
//@route            Put /api/v1/stars/:id
//@auth             Private/Admin
exports.updateStar =  asyncHandler(async (req, res, next)=>{
    const star = await Star.findById(req.params.id)
    const editedStar = {
        name: req.body.name || star.name,
        temprature: req.body.temprature || star.temprature,
        massa: req.body.massa || star.massa,
        diametr: req.body.diametr || star.diametr 
    }

    const updatedStar = await Star.findByIdAndUpdate(req.params.id, editedStar, {
        new: true
    })


    return res.status(200).json({
        success: true,
        data: updatedStar
    })
})




//@desc             Delete star 
//@route            Delete /api/v1/stars/:id
//@auth             Private/Admin
exports.deleteStar =  asyncHandler(async (req, res, next)=>{
    await Star.findByIdAndDelete(req.params.id)
    return res.status(200).json({
        success: true,
        message: 'Data successfully deleted'
    })
})