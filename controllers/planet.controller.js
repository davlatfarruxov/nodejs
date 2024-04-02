const Star = require('../models/star.model')
const Planet = require('../models/planet.model')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')



//@desc             Get all stars
//@route            Get /api/v1/planets
//@auth             Public / with apiKey
exports.getAllPlanets =  asyncHandler(async (req, res, next)=>{
    const pageLimit = process.env.DEFAULT_PAGE_LIMIT || 5
    const limit = parseInt(req.query.limit) || pageLimit
    const page = parseInt(req.query.page) || 1
    const total = await Planet.countDocuments()

    const planets = await Planet
    .find()
    .skip((page*limit)-limit)
    .limit(limit)

    res.status(200).json({
        success: true,
        pageCount: Math.ceil(total/limit),
        currentPage: page,
        nextpage: Math.ceil(total/limit) < page+1 ? null : page+1,
        data: planets
    })
})



//@desc             Create new planet
//@route            POST /api/v1/planets
//@auth             Private / Admin
exports.addNewPlanet =  asyncHandler(async (req, res, next)=>{
    const star = await Star.findOne({name: req.body.star})
    console.log(star._id);
    const newPlanet = await Planet.create({
        name: req.body.name,
        distanceToStar: req.body.distanceToStar,
        diametr: req.body.diametr,
        yearDuration: req.body.yearDuration,
        dayDuration: req.body.dayDuration,
        satellates: req.body.satellates,
        temprature: req.body.temprature,
        sequenceNumber: req.body.sequenceNumber,
        image: 'uploads/' + req.file.filename,
        star: star._id
    })

    await Star.findOneAndUpdate({name: req.body.star},
        {$push: {planets: newPlanet._id}},
        {
            new: true, upsert: true
        } 
    )
        
    res.status(201).json({
        success: true,
        data: newPlanet
    }) 
})



//@desc             Get one planet by id
//@route            Get /api/v1/planets/:id
//@auth             Public / with apiKey
exports.getPlanetById =  asyncHandler(async (req, res, next)=>{
    const planet = await Planet.findById(req.params.id)

    res.status(200).json({
        success: true,
        data: planet
    })
})



 
//@desc             Update planet
//@route            Put /api/v1/stars/:id
//@auth             Private/Admin
exports.updatePlanet =  asyncHandler(async (req, res, next)=>{
    const planet = await Planet.findById(req.params.id)
    const editedPlanet = {
        name: req.body.name || planet.name,
        temprature: req.body.temprature || planet.temprature,
        diametr: req.body.diametr || planet.diametr,
        distanceToStar: req.body.distanceToStar || planet.distanceToStar,
        yearDuration: req.body.yearDuration || planet.yearDuration,
        dayDuration: req.body.dayDuration  || planet.dayDuration,
        satellates: req.body.satellates || planet.satellates,
        sequenceNumber: req.body.sequenceNumber || planet.sequenceNumber,
    }


    const updatedPlanet = await Planet.findByIdAndUpdate(req.params.id, editedPlanet, {
        new: true
    })


    return res.status(200).json({
        success: true,
        data: updatedPlanet
    })
})



//@desc             Delete planet 
//@route            Delete /api/v1/planets/:id
//@auth             Private/Admin
exports.deletePlanet =  asyncHandler(async (req, res, next)=>{
    await Planet.findByIdAndDelete(req.params.id)
    return res.status(200).json({
        success: true,
        message: 'Data successfully deleted'
    })
})