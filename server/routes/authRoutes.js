const express = require('express')
const router = express.Router()
const cors= require('cors')
const { test, registerUser, loginUser, getProfile, viewUsers,
    authenticateToken, registerHospitalSystem, deleteUser, updateUser, logoutUser, 
    setPassword, userRole, handleReports,
    viewReports, deleteReport, handleFeedback, viewFeedback} = require('../controllers/authController')


//middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

/********************* USER SYSTEM *****************/
router.get('/', test)
router.post('/register', authenticateToken, registerUser),
// router.post('/registerbackend', registerUser),
router.post('/login', loginUser)
router.get('/profile',authenticateToken, getProfile)

router.get('/dashboard',authenticateToken, userRole)

router.delete('/cancelreport', authenticateToken, deleteReport)


router.get('/viewusers', authenticateToken, viewUsers)
router.get('/viewreports', authenticateToken, viewReports)
router.delete('/users/:id', authenticateToken, deleteUser)
router.post('/users/:id', updateUser)

router.post('/setpassword', setPassword)


router.post('/report/:level', authenticateToken, handleReports)
router.post('/registerhospitalsystem', registerHospitalSystem)
router.post('/logout', logoutUser)

router.post('/submitfeedback', authenticateToken, handleFeedback)
router.get('/viewfeedback', authenticateToken, viewFeedback)

module.exports = router 
