
const User = require('../models/user')
const HospitalSystem = require('../models/hospitalsystem')
const Report = require('../models/report')
const Feedback = require('../models/feedback')
const { hashPassword, comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // Import the crypto module


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
        const hospitalSystem = await HospitalSystem.findById(requestingUser.institution);
       

        const user = await User.create({name, surname, location, email, password: hashedPassword, institution: institution, admin: admin})

        console.log('im here')
    
        //update hospital's list
        hospitalSystem.members.push(user._id);
        await hospitalSystem.save();
        console.log('i am done')
        return res.json(user)

    } catch (error) { console.log(error) }

}


////////////


const registerHospitalSystem = async (req, res) => {
    try {
        const {institutionName, institutionEmail} = req.body;

        //check if name is entered
        if (!institutionName) return res.json({ error: 'Name is required'})

        //check if email exists
        const exist = await HospitalSystem.findOne({institutionEmail}) || await User.findOne({institutionEmail})
        
        
        if (exist) return res.json({error: 'This email is already registered either as a user or a hospital system!'})

        //create hospital system
        const hospitalsystem = await HospitalSystem.create({institutionName, institutionEmail})

        
        //create an admin user 

          // Generate verification token (to create password)
          const token = generateVerificationToken(institutionEmail);

          //send the email
          sendVerificationEmail(institutionEmail, token);
  
          const password = generateUniqueString()
  
          const hashedPassword = await hashPassword(password)
          // console.log('institution name is')
          // console.log(institution)

        const admin = await User.create({name: institutionName, surname: 'Hospital', email: institutionEmail, password: hashedPassword, institution: hospitalsystem._id, admin: true})
        
        const secretUserEmail = institutionName.replace(/\s+/g, '').toLowerCase() + '@shelfquest.app'
        const secretUserPassword = await hashPassword(process.env.SECRET_USER)
        const secretUser = await User.create({name: 'Shelfquest', surname: 'Admin', email: secretUserEmail, password: secretUserPassword, institution: hospitalsystem._id, admin: true})
       
        //add admin to the hospital system
       hospitalsystem.members.push(admin._id)
       hospitalsystem.members.push(secretUser._id)
       await hospitalsystem.save();


        return res.json(hospitalsystem)

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
            jwt.sign({email: user.email, id: user._id, name: user.name, institution: user.institution, surname: user.surname, admin: user.admin, location: user.location}, process.env.JWT_SECRET, {}, (err, token)=>{
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
        console.log('THIS IS THE USER')
        console.log(user)
        next();
    })
    }
}
        
   

////////////////

const viewUsers = async (req, res) => {

    try {
          
        const hospitalSystemId = req.user.institution

        

        // find the hospital system by ID and populate the members field
        const hospitalSystem = await HospitalSystem.findById(hospitalSystemId).populate('members').exec();

        if (!hospitalSystem) {
            return res.status(404).json({ error: 'Hospital System not found' });
        }


        // The populated members will be an array of user documents

        return res.json(hospitalSystem.members);
     
    } catch (error) {
        console.error('Error retrieving users:', error);
        return res.json({ error: 'Internal Server Error' });
    }



}

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

const handleReports = async (req, res) => {

  try{
    const level = parseInt(req.params.level, 10);
    const currUser = req.user
    
    location = ''
    if (req.body.location == ''){
      location = currUser.location
    }

    else{
      location = req.body.location
    }

    // console.log('USER during')
    // console.log(currUser)
    // console.log(currUser._id)
    
    //change to EMAIL
    userId = await User.findOne({name: currUser.name, surname: currUser.surname}).select('_id');
    // console.log(userId)
    const report = await Report.create({user: userId, level: level, location: location})
    // console.log('REPORT IS')
    // console.log(report)
    const hospital = await HospitalSystem.findById(currUser.institution)

    console.log('HOSPITAL')
   console.log(hospital)

    // Save the updated hospital document
    hospital.reports.push(report._id);
    await hospital.save();
  } catch (err){
    console.log(err)
    res.status(401).json({err})
    return;
  }
   
  res.status(200).json('OK')
    
}


const viewReports = async (req, res) => {

  try {
        
      const hospitalSystemId = req.user.institution

      console.log('HOSPITAL ID')
      console.log(hospitalSystemId)

      // find the hospital system by ID and populate the members field
      // const hospitalSystem = await HospitalSystem.findById(hospitalSystemId).populate('reports').exec();
      const hospitalSystem = await HospitalSystem.findById(hospitalSystemId)
      .populate({
        path: 'reports', 
        populate: {
          path: 'user',  // Reference to the user
          select: 'name surname' // Only populate the 'name' field from the User model
        }
      })
      .exec();


      if (!hospitalSystem) {
          return res.status(404).json({ error: 'Hospital System not found' });
      }
        console.log('WELL')
        console.log(hospitalSystem.reports)
      // The populated members will be an array of user documents

      return res.json(hospitalSystem.reports);
   
  } catch (error) {
      console.error('Error retrieving users:', error);
      return res.json({ error: 'Internal Server Error' });
  }



}


const deleteReport = async (req, res) => {

  try {
    const level = parseInt(req.body.level, 10)
    const name = req.user.name
    const surname = req.user.surname
    console.log(name)
    console.log(surname)
    console.log(level)
    console.log(req.user.email)
    const requestingUser = await User.findOne({email: req.user.email})

    //console.log(requestingUser)
    const latestReport = await Report.find({
      user: requestingUser,
      level: level

    })
     .sort({ createdAt: -1 })  // Sort by 'created_at' in descending order (latest first)
     .exec();
   console.log('LATEST')
    console.log(latestReport[0])
    const result = await Report.deleteOne(latestReport[0])

    if (!result) {
      res.status(500).json({ error: 'Internal server error, try again' });
    }

    res.status(200).json({ message: 'Report cancelled successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error, try again' });
  }
};



const handleFeedback = async (req, res) => {
  // const title = req.params.title
  // const message = req.params.message

  // const isAnonymous = req.params.isAnonymous
  // const isSentToMedSafe = req.params.isSentToMedSafe
  //const { title, message, isAnonymous, isSentToMedSafe } = req.body;

  try{
  const { title, message, isAnonymous } = req.body;

  console.log(title)
  console.log(message)
  console.log(isAnonymous)

  
  if (!isAnonymous){
    userId = await User.findOne({email: req.user.email}).select('_id');
  }
  else{
    userId = null;
  }
  
  const form = await Feedback.create({title: title, body: message, user: userId, isAnonymous: isAnonymous })

  const hospital = await HospitalSystem.findById(req.user.institution)

  console.log('HOSPITAL')
 console.log(hospital)

  // Save the updated hospital document
  hospital.feedback.push(form._id);
  await hospital.save();
}
catch (err){
  res.status(500).json('internal server error')
}
  res.status(200).json('oKI!')
}


module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    viewUsers,
    authenticateToken,
    registerHospitalSystem,
    deleteUser,
    updateUser,
    logoutUser,
    setPassword,
    userRole,
    handleReports,
    viewReports,
    deleteReport,
    handleFeedback

}

