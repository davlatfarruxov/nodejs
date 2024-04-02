const {Router} = require('express')
const {
    register,
    login,
    getProfile,
    updateDetails,
    updatePassword,
    activateProfile,
    balancePayment 
} = require('../controllers/auth.controller')
const router = Router()
const {protected} = require('../middlewares/auth')



router.post('/register', register)
router.post('/login', login)
router.get('/profile', protected, getProfile)
router.put('/update', protected, updateDetails)
router.put('/updatepassword', protected, updatePassword)
router.put('/paymentbalance', protected, balancePayment )
router.put('/activateprofile', protected, activateProfile)



module.exports = router