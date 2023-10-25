const express = require('express');
const dotenv = require('dotenv');
const ConnectToDataBase = require("./DataBase/Connection")
const SignupRoute = require('./Routes/Auth/Signup')
const LoginRoute = require('./Routes/Auth/Login')
const VerificationRoute = require('./Routes/Auth/Verification')
const ResetPasswordRoute = require('./Routes/Auth/PasswordReset')


const cors = require('cors');
const { decodeToken } = require('./Utils/AuthUtils');

//creating express app
const app = express();

//app configurations
app.use(express.json())
dotenv.config()
app.use(cors());

//handling routes
app.get('/', (req, res) => {
    res.status(200).json({
        message: "OK"
    })
})

app.post('/decodeToken', async (req, res) => {
    try {
        const decodedToken = await decodeToken(req.body.token);
        res.json({
            message: "OK",
            data: decodedToken
        })
    }
    catch (error) {
        console.error(error);
        res.json({
            message: "error",
            error: error
        })
    }
})

app.use('/authentication', SignupRoute);
app.use('/authentication', LoginRoute);
app.use('/authentication', VerificationRoute)
app.use('/authentication', ResetPasswordRoute)

//app routes


//setting up the PORT
const PORT = process.env.PORT || 5500;

//starting the server
app.listen(PORT, async () => {
    console.log("Server is starting...");
    await ConnectToDataBase();
    console.log('Server is up and running on PORT : ' + PORT);
})