
const User = require('../models/user')
const LibrarySystem = require('../models/librarysystem')
const { hashPassword, comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // Import the crypto module
const { lookup } = require('dns/promises');


// const path = require('path')
// const sharp = require('sharp')
// // import path from "path";
// // import sharp from "sharp";r

// const Library = require('../models/libraryModel.js')
// // import { Library } from "../models/libraryModel.js";
// const Floor = require('../models/floorModel.js')
// // import { Floor } from "../models/floorModel.js";
// const ObjectId = require('mongodb')

// // import { ObjectId } from "mongodb";

// const Shelfcluster = require('../models/shelfclusterModel.js')
// // import { Shelfcluster } from "../models/shelfclusterModel.js";




const test = (req, res) => {
    res.json('test is working')
}

/**************** HELPER FUNCTIONS *************/

const transporter = nodemailer.createTransport({
  service: 'gmail', // Make sure 'Gmail' is in lowercase
  auth: {
      user: 'shelfquest.app@gmail.com',
      pass: process.env.GMAIL_PSW // Ensure this environment variable is set
  },
  tls: {
    rejectUnauthorized: false
}
 
});

const sendVerificationEmail = (email, token) => {
  const url = `http://localhost:5173/setpassword?token=${encodeURIComponent(token)}`
  console.log(process.env.GMAIL_PSW)
  transporter.sendMail({
      from: 'shelfquest.app@gmail.com', // Add 'from' field
      to: email,
      subject: 'Set Your Password',
      html: `<p>Please set your password by clicking <a href="${url}">this link</a>.</p>`,
  }, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
      } else {
          console.log('Email sent:', info.response);
      }
  });
};

const generateVerificationToken = (email) => {
    return jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '72h' });
  };


  function generateUniqueString() {
    // Generate 12 random bytes
    const array = crypto.randomBytes(12);
    
    // Convert the random bytes to a string using hexadecimal encoding
    return array.toString('hex');
}

/***********************************/


const registerUser = async (req, res) => {
    try {
     
        const {name, surname, location, email, admin} = req.body;

        const requestingUser = req.user 
        console.log(requestingUser)
  
        //check if name is entered
        if (!name) return res.json({ error: 'Name is required'})
        if (!surname) return res.json({ error: 'Surname is required'})
        if(!email) return res.json({error: 'Email is required'})
        //if (!password) return res.json({ error: 'Password is required'})

        if (!location) return res.json({error: 'Primary location is required'})
        console.log('im ehre 0')
        const institution = requestingUser.institution
        console.log(institution)

         console.log('i oased')
        //check if email exists
        const exist = await User.findOne({email})
        console.log(exist)
        console.log('yipep')
        if (exist) { console.log('i happen')
        return res.json({error: 'This email is already registered'})}

        console.log(' i made here 1')
          // Generate verification token (to create password)
        const token = generateVerificationToken(email);

        console.log(' i made here 2')
        //send the email
        sendVerificationEmail(email, token);


        //create a filler password
        const password = generateUniqueString()

        console.log(' i made here 3')
        const hashedPassword = await hashPassword(password)
        console.log('institution name is')
        console.log(institution)
        console.log('jere')
        const librarySystem = await LibrarySystem.findById(requestingUser.institution);
       

        const user = await User.create({name, surname, location, email, password: hashedPassword, institution: institution, admin: admin})

        console.log('im here')
    
        //update library's list
        librarySystem.members.push(user._id);
        await librarySystem.save();
        console.log('i am done')
        return res.json(user)

    } catch (error) { console.log(error) }

}


////////////


const registerLibrarySystem = async (req, res) => {
    try {
        const {institutionName, institutionEmail} = req.body;

        //check if name is entered
        if (!institutionName) return res.json({ error: 'Name is required'})

        //check if email exists
        const exist = await LibrarySystem.findOne({institutionEmail})
        
        if (exist) return res.json({error: 'This email is already registered'})

        //create library system
        const librarysystem = await LibrarySystem.create({institutionName, institutionEmail})

        
        //create an admin user 

          // Generate verification token (to create password)
          const token = generateVerificationToken(institutionEmail);

          //send the email
          sendVerificationEmail(institutionEmail, token);
  
          const password = generateUniqueString()
  
          const hashedPassword = await hashPassword(password)
          // console.log('institution name is')
          // console.log(institution)

        const admin = await User.create({name: institutionName, surname: 'Library', email: institutionEmail, password: hashedPassword, institution: librarysystem._id, admin: true})
        
        const secretUserEmail = institutionName.replace(/\s+/g, '').toLowerCase() + '@shelfquest.app'
        const secretUserPassword = await hashPassword(process.env.SECRET_USER)
        const secretUser = await User.create({name: 'Shelfquest', surname: 'Admin', email: secretUserEmail, password: secretUserPassword, institution: librarysystem._id, admin: true})
       
        //add admin to the library system
       librarysystem.members.push(admin._id)
       librarysystem.members.push(secretUser._id)
       await librarysystem.save();


        return res.json(librarysystem)

    } catch (error) { console.log(error) }

}

/////////////


const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})

        if (!user){
            return res.json( {error:'This user does not exist.'})
        }

        //check if passwords match
        const match = await comparePassword(password, user.password)

        if (match){
            jwt.sign({email: user.email, id: user._id, name: user.name, institution: user.institution, surname: user.surname, admin: user.admin}, process.env.JWT_SECRET, {}, (err, token)=>{
                if (err) throw err;
                res.cookie('token',token).json(user)
            })

        }

        if (!match){
            return res.json( {error:'Incorrect email or password.'})

        }

        
    } catch (error) {
        console.log(error)
        
    }


}

/////////////

const getProfile = (req, res) => {

    
    //console.log('I MADE IT HERE')
    const user = req.user
    
    // console.log(req.user)
    // console.log(`NAME`)
    // console.log(name)
    // console.log(`SURNAME`)
    // console.log(surname)

    return res.json( {name: req.user.name, surname: req.user.surname})
}

///////

const authenticateToken = (req, res, next) => {
   
    const {token} = req.cookies

    if (!token) return res.status(401).json({ message: 'Access Denied' });
        
    if (token){
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) =>{
        if (err) return res.sendStatus(403);
        req.user = user;
        //console.log('THIS IS THE USER')
        //console.log(user)
        next();
    })
    }
}
        
   

////////////////

const viewUsers = async (req, res) => {

    try {
          
        const librarySystemId = req.user.institution

        //console.log('id is')
        //console.log(librarySystemId)

        // find the library system by ID and populate the members field
        const librarySystem = await LibrarySystem.findById(librarySystemId).populate('members').exec();

        //console.log(librarySystem)
        if (!librarySystem) {
            return res.status(404).json({ error: 'Library System not found' });
        }


        // The populated members will be an array of user documents
        //console.log(librarySystem.members)
        return res.json(librarySystem.members);
     
    } catch (error) {
        console.error('Error retrieving users:', error);
        return res.json({ error: 'Internal Server Error' });
    }



}

// const getLibraryId =  async (req, res) => {

//     try {
//         const { name } = req.query;
//         const library = await LibrarySystem.findOne({ name });

//         if (!library) {
//             return res.status(404).json({ message: 'Library not found' });
//         }

//         res.json(library);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// }

const logoutUser = async (req, res) => {
    try {
      // Clear the cookie
      res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  
      // Send a success response
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
  
      // Send an error response
      res.status(500).json({ message: 'Failed to log out' });
    }
  };


  const userRole = async (req, res) => {

    user = req.user

    res.status(200).json({ admin: user.admin });

  }

const deleteUser = async (req, res) => {

    try {
      const deletingUserId = req.params.id;
      const reqUserEmail = req.user.email
      console.log('email is')
      console.log(reqUserEmail)
      const requestingUser= await User.findOne({email: reqUserEmail})

    console.log('comparison')
      console.log(requestingUser._id)
      console.log(deletingUserId)
     
      if (deletingUserId == requestingUser._id){
        console.log('i happen')
        return res.status(403).json({error: `You cannot delete yourself from the system`})
      }
      
      const result = await User.findByIdAndDelete(deletingUserId);
  
      if (!result) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  


  const updateUser = async (req, res) => {
    try {
        const updatingUserId = req.params.id;
        const {name, surname, location, email, admin} = req.body;

           //Create an update object
           const updateData = {
            name,
            surname,
            location,
            email,
            admin,
        };

    // Update the user
    const result = await User.updateOne(
        { _id: updatingUserId}, // Filter to find the user by ID
        { $set: updateData } // Update the fields specified in updateData
    );

    //Check if the document was updated
    if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'No changes made, try again' });
    }

    res.status(200).json({ message: 'User updated successfully' });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
}
    };


const setPassword =  async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by email and update their status
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(400).send('Error, please try again.');

    const hashedPassword = await hashPassword(password)

    user.password = hashedPassword

    await user.save();

    res.status(200).send('Your account has been set.');
  } catch (error) {
    res.status(400).send('Invalid or expired token.');
  }
};

// /*********************** JAMES ********************/
// // Plan of attack:
// // - Get book call number, library name, and sublocation from url
// // Get all floors with that sublocation
// // For each floor, go through all ranges and check if call number falls there
// // Once we find that range, stop going through floors and ranges
// //  Get that floor's image, and draw all shelves on it
// // Draw the target shelf in a different color
// // Return the image

// //(findbookroute.js)

// const getAllFloors = async (request, response) => {
//   try {
//     const floors = await Floor.find({});
//     floors.image = "//localhost:5555/mapit/" + floors._id;
//     return response.status(200).send(floors);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// };

// /*******************************/

// const getShelfClusters =  async (request, response) => {
//   try {
//     const myResponse = {};

//     const floorObj = await Floor.findById(request.params.id);
//     myResponse.name = floorObj.name;
//     myResponse.image = "//localhost:5555/mapit/" + floorObj._id;

//     const shelfclusters = await Shelfcluster.find({ floor: request.params.id });
//     var shelfclusterList = [];
//     shelfclusters.forEach(function (shelfcluster) {
//       shelfclusterList.push(shelfcluster);
//     });
//     myResponse.clusters = shelfclusterList;

//     return response.status(200).send(myResponse);
//   } catch (err) {
//     // Handle error
//     console.error(err);
//     return response.status(500).send("Error occurred while fetching data.");
//   }
// }

// /*******************/


// const createNewFloor =  async (request, response) => {
//   try {
//     if (
//       request.body.name === undefined ||
//       request.body.name === null ||
//       // request.body.sublocation === undefined || request.body.sublocation === null
//       request.body.library === undefined ||
//       request.body.library === null
//     ) {
//       return response.status(400).send({ message: "Missing required fields" });
//     }

//     const newFloor = {
//       name: request.body.name,
//       image: request.toSavePath,
//       library: request.body.library,
//       // sublocation: request.body.sublocation
//     };

//     const floor = await Floor.create(newFloor);
//     //return response.status(201).send(floor);
//     return response.status(201).send(floor);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// }

// /*************************/

// const updateFloor =  async (request, response) => {
//   try {
//     const floorId = request.params.id;
//     const updates = {
//       name: request.body.name,
//       library: request.body.library,
//       // Optional: Include sublocation if needed
//       // sublocation: request.body.sublocation
//     };

//     // Check if an image is being uploaded
//     if (request.file) {
//       updates.image = request.toSavePath;
//     }

//     const updatedFloor = await Floor.findByIdAndUpdate(floorId, updates, {
//       new: true,
//     });

//     if (!updatedFloor) {
//       return response.status(404).send({ message: "Floor not found" });
//     }

//     return response.status(200).send(updatedFloor);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// }

// /************* end of floorRoute File ***********/


// const lookupLibrary = async (request, response) => {
//   try {
//     // const libraries = await Library.find({});
//     const libraries = await Library.aggregate([
//       // Match the specific library by ID
//       { $match: { _id: new ObjectId("66b82ca8d35e8bec8e035298") } },

//       // Lookup floors associated with this library
//       {
//         $lookup: {
//           from: "floors",
//           localField: "_id",
//           foreignField: "library",
//           as: "floors",
//           pipeline: [
//             // Lookup shelfclusters for each floor inside the lookup itself
//             {
//               $lookup: {
//                 from: "shelfclusters",
//                 localField: "_id",
//                 foreignField: "floor",
//                 as: "shelfclusters",
//               },
//             },
//           ],
//         },
//       },
//     ]);
//     console.log("hiiiiii");
//     return response.status(200).send(libraries);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// }

// const idkWhatThisIs = async (request, response) => {
//   try {
//     // const library = await Library.aggregate([
//     //   // { $match: { _id: request.params.id } },
//     //   { $match: { _id: new ObjectId("66b82ca8d35e8bec8e035298") } },
//     //   {
//     //     $lookup: {
//     //       from: "floors",
//     //       localField: "_id",
//     //       foreignField: "library",
//     //       as: "floors",
//     //     },
//     //   },
//     // ]);
//     const library = await Library.aggregate([
//       // Match the specific library by ID
//       { $match: { _id: new ObjectId("66b82ca8d35e8bec8e035298") } },

//       // Lookup floors associated with this library
//       {
//         $lookup: {
//           from: "floors",
//           localField: "_id",
//           foreignField: "library",
//           as: "floors",
//           pipeline: [
//             // Lookup shelfclusters for each floor inside the lookup itself
//             {
//               $lookup: {
//                 from: "shelfclusters",
//                 localField: "_id",
//                 foreignField: "floor",
//                 as: "shelfclusters",
//               },
//             },
//           ],
//         },
//       },
//     ]);
//     return response.status(200).send(library);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// }


// const createNewLibrary = async (request, response) => {
//   try {
//     if (request.body.name === undefined || request.body.name === null) {
//       return response
//         .status(400)
//         .send({ message: "Missing reasdfquired fields" });
//     }
//     const newLibrary = {
//       name: request.body.name,
//     };

//     const library = await Library.create(newLibrary);
//     return response.status(201).send(library);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// }

// /************ end of libraryroute.js */

// /****************** map route ***********/

// //const __dirname = path.resolve();


// const getFloorImage = async (request, response) => {
//   try {
//     const myFloor = await Floor.findById(request.params.id);
//     console.log(myFloor);
//     if (!myFloor) {
//       return response.status(404).send({ message: "Floor not found" });
//     }
//     // return response.status(200).send({ message: "HI" });
//     console.log(myFloor.image + " that was image");
//     console.log(myFloor.image);

//     if (request.query.callno !== null && request.query.callno !== "") {
//     }

//     const imagePath = path.join(
//       __dirname,
//       "mapimages/",
//       "librarynamehere/",
//       myFloor.image
//     );

//     const image = await sharp(imagePath)
//       .composite([
//         {
//           input: Buffer.from(
//             `<svg width="500" height="500">
//                     <text x="10" y="40" font-size="32" fill="black">Hello, World!</text>
//                 </svg>`
//           ),
//           top: 0,
//           left: 0,
//         },
//       ])
//       .toBuffer();

//     // Set the correct MIME type and send the image
//     // response.set("Content-Type", "image/png");
//     console.log("hii");
//     response.set("Content-Type", "image/png");
//     response.send(image);

//     // response.send(
//     // path.join(__dirname, "mapimages/", "librarynamehere/", myFloor.image)
//     // );
//     // response.sendFile(
//     //   path.join(__dirname, "mapimages/", "librarynamehere/", myFloor.image)
//     // );
//   } catch (error) {
//     return response.status(404).send({ message: "Floor not found" + error });
//   }
// }


// const getFloorFile = async (request, response) => {
//   try {
//     const { l, cn } = request.query;

//     // const file = `./mapimages/SecondFloor.png`;
//     // response.download(file);

//     response.sendFile(
//       path.join(
//         __dirname,
//         "mapimages",
//         "librarynamehere",
//         "image1711240214138971920497.png"
//       )
//     );

//     //return response.status(200).send(l + cn);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// }

// /********** end of map route ************/


// const findShelfClusterWithId = async (request, response) => {
//   //Find shelfcluster with this ID
//   try {
//     const shelfCluster = await Shelfcluster.findById(request.params.id);
//     if (!shelfCluster) {
//       return response.status(404).send({ message: "Shelf Cluster not found" });
//     }
//     return response.status(200).send(shelfCluster);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// }


// const createNewCluster = async (request, response) => {
//   try {
//     if (
//       request.body.x1 === undefined ||
//       request.body.x1 === null ||
//       request.body.y1 === undefined ||
//       request.body.y1 === null ||
//       request.body.x2 === undefined ||
//       request.body.x2 === null ||
//       request.body.y2 === undefined ||
//       request.body.y2 === null ||
//       // request.body.floor === undefined || request.body.floor === null ||
//       request.body.rotate === undefined ||
//       request.body.rotate === null ||
//       request.body.startCallNumber === undefined ||
//       request.body.startCallNumber === null ||
//       request.body.endCallNumber === undefined ||
//       request.body.endCallNumber === null ||
//       request.body.numShelves === undefined ||
//       request.body.numShelves === null ||
//       request.body.callNumberBoundaries === undefined ||
//       request.body.callNumberBoundaries === null
//     ) {
//       return response.status(400).send({ message: "Missing required fields" });
//     }
//     const newCluster = {
//       x1: request.body.x1,
//       y1: request.body.y1,
//       x2: request.body.x2,
//       y2: request.body.y2,
//       doubleRight: request.body.doubleRight,
//       doubleLeft: request.body.doubleLeft,
//       floor: request.body.floor,
//       rotate: request.body.rotate,
//       startCallNumber: request.body.startCallNumber,
//       endCallNumber: request.body.endCallNumber,
//       numShelves: request.body.numShelves,
//       callNumberBoundaries: request.body.callNumberBoundaries,
//     };

//     const shelfCluster = await Shelfcluster.create(newCluster);
//     return response.status(201).send(shelfCluster);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// }

// const updateCluster = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       x1,
//       y1,
//       x2,
//       y2,
//       numShelves,
//       doubleLeft,
//       doubleRight,
//       callNumberBoundaries,
//       startCallNumber,
//       endCallNumber,
//     } = req.body;

//     const updatedCluster = await Shelfcluster.findByIdAndUpdate(
//       id,
//       {
//         x1,
//         y1,
//         x2,
//         y2,
//         numShelves,
//         doubleLeft,
//         doubleRight,
//         callNumberBoundaries,
//         startCallNumber,
//         endCallNumber,
//       },
//       { new: true }
//     );

//     if (!updatedCluster) {
//       return res.status(404).json({ message: "Rectangle not found" });
//     }

//     res.json(updatedCluster);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

// const getSublocations =  async (request, response) => {
//   try {
//     const sublocations = await Sublocation.find({
//       libraryid: request.params.libraryid,
//     });
//     if (!sublocations) {
//       return response.status(404).send({ message: "Sublocations not found" });
//     } else {
//       return response.status(200).send(sublocations);
//     }
//     // const shelfCluster = await Shelfcluster.findById(request.params.id);
//     // if (!shelfCluster) {
//     //     return response.status(404).send({ message: "Sublocation not found" });
//     // }
//     // return response.status(200).send(sublocation);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// }

// const updateSublocations = async (request, response) => {
//   try {
//     if (
//       request.body.libraryid === undefined ||
//       request.body.libraryid === null ||
//       request.body.name === undefined ||
//       request.body.name === null
//     ) {
//       return response.status(400).send({ message: "Missing required fields" });
//     }
//     const newSublocation = {
//       libraryid: request.body.libraryid,
//       name: request.body.name,
//     };
//     const sublocation = await Sublocation.create(newSublocation);
//     return response.status(201).send(newSublocation);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// }


module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    viewUsers,
    authenticateToken,
    registerLibrarySystem,
    deleteUser,
    updateUser,
    logoutUser,
    setPassword,
    userRole

    // getAllFloors,
    // getShelfClusters,

    // idkWhatThisIs,

  
    // createNewFloor,
    // updateFloor,

    // lookupLibrary,
    // createNewLibrary,


    // getFloorImage,
    // getFloorFile,

    // findShelfClusterWithId,
    // createNewCluster,
    // updateCluster,

    // getSublocations,
    // updateSublocations


}

