const express = require('express')
const router = express.Router()
const cors= require('cors')
const { test, registerUser, loginUser, getProfile, viewUsers,
    authenticateToken, registerLibrarySystem, deleteUser, updateUser, logoutUser, 
    setPassword, userRole} = require('../controllers/authController')

// const fs = require('fs')
// const multer = require('multer')
// // import fs from "fs";
// // import multer from "multer";

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


router.get('/viewusers', authenticateToken, viewUsers)
router.delete('/users/:id', authenticateToken, deleteUser)
router.post('/users/:id', updateUser)

router.post('/setpassword', setPassword)


router.post('/registerlibsystem', registerLibrarySystem)
router.post('/logout', logoutUser)


// /************* JAMES ************/

// /*********** misc for james ************/



// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       const audPath = "mapimages/" + "librarynamehere" + "/";
//       fs.mkdirSync(audPath, { recursive: true });
  
//       cb(null, audPath);
//     },
//     filename: function (req, file, cb) {
//       const toSavePath =
//         file.fieldname +
//         Date.now() +
//         Math.round(Math.random() * 1e9) +
//         path.extname(file.originalname);
//       req.toSavePath = toSavePath;
//       cb(null, toSavePath);
//     },
//   });
  
  
//   const upload = multer({ storage: storage });

//   /********** FLOOR ***************/

// router.get('/', getAllFloors)

// router.get('/:id', getShelfClusters)

// router.post('/',upload.single('image'), createNewFloor)

// router.put('/:id', upload.single("image"), updateFloor )


// /****************LIBRARY **********************/

// router.get('/', lookupLibrary)

//  router.get('/:id', idkWhatThisIs)

// router.post('/', createNewLibrary)

// /****************** MAP ****************************/


// router.get('/:id', getFloorImage)

// router.get('/', getFloorFile)

// /******************* SHELF CLUSTER ****************/

// router.get('/:id', findShelfClusterWithId)

// router.post('/', createNewCluster)

// router.put('/:id', updateCluster)

// /***************** SUBLOCATIONS  *************/

// router.get('/:libraryid', getSublocations)

// router.post('/', updateSublocations)

module.exports = router 
