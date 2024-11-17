const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express();
const port = 8000;


//database connection
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('Database connected'))
.catch((err) => console.log('error', err))

// app.use(
//     cors({
//       origin: ["http://localhost:3000", "http://localhost:5173"],
//       methods: ["GET", "POST", "PUT"], //add put and delete once we've done those
//       allowedHeaders: ["Content-Type"],
//     })
//   );

//parsing json
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

app.use('/', require('./routes/authRoutes'))

app.use("/assets", express.static("assets"));


app.listen(port, () => console.log(`Server is running on port ${port} :)`))