const {Router} = require('express')
const {
    getAllStars,
    createNewStar,
    getStarById,
    updateStar,
    deleteStar
} = require('../controllers/star.controller')

const {protected, adminAccess, apiKeyAccess} = require('../middlewares/auth')

const upload = require('../utils/fileUpload')
const router = Router()
 


router.get('/', apiKeyAccess,  getAllStars)
router.post('/', protected, adminAccess, upload.single('image'), createNewStar)
router.get('/:id', apiKeyAccess, getStarById)
router.put('/:id', protected, adminAccess, updateStar)
router.delete('/:id', protected, adminAccess, deleteStar)

module.exports = router