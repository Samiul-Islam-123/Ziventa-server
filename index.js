const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const ConnectToDataBase = require("./DataBase/Connection");
const SignupRoute = require("./Routes/Auth/Signup");
const LoginRoute = require("./Routes/Auth/Login");
const VerificationRoute = require("./Routes/Auth/Verification");
const ResetPasswordRoute = require("./Routes/Auth/PasswordReset");

const cors = require("cors");
const { decodeToken } = require("./Utils/AuthUtils");
const UploadControlRouter = require("./Routes/App/OwnerControl/UploadControl");
const FetchControlRoute = require("./Routes/App/OwnerControl/FetchControl");
const ClientFetchControlRoute = require("./Routes/App/ClientControl/FetchControl");
const ClientUploadRoute = require("./Routes/App/ClientControl/UploadControl");
const ClientDeleteControlRoute = require("./Routes/App/ClientControl/DeleteControls");
const AuthUtils = require("./Utils/AuthUtils");
const OrderModel = require("./DataBase/Models/OrderModel");
//creating express app
const app = express();

//app configurations
app.use(express.json());
app.use(cors());

//handling routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "OK",
  });
});

app.get("/cancel/:orderID",async (req, res) => {
  const result = await OrderModel.findByIdAndDelete(req.params.orderID)

  if(result){
    // Deletion successful, redirect to /cart url
    res.redirect(`${process.env.FRONTEND}/cart`);
  }

  else{
    res.json({
      message : "DELETION FAILED"
    })
  }

});

app.post("/decodeToken", async (req, res) => {
  try {
    const decodedToken = await decodeToken(req.body.token);
    res.json({
      message: "OK",
      data: decodedToken,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "error",
      error: error,
    });
  }
});

//auth routes
app.use("/authentication", SignupRoute);
app.use("/authentication", LoginRoute);
app.use("/authentication", VerificationRoute);
app.use("/authentication", ResetPasswordRoute);

//app routes

//owner controls
app.use("/app/owner", UploadControlRouter);
app.use("/app/owner", FetchControlRoute);

//client controls
app.use("/app/client", ClientFetchControlRoute);
app.use("/app/client", ClientUploadRoute);
app.use("/app/client", ClientDeleteControlRoute);

app.post("/app/decode", async (req, res) => {
  try {
    const decodedToken = await AuthUtils.decodeToken(req.body.token);
    res.json({
      message: "OK",
      Details: decodedToken,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "error",
      error: error,
    });
  }
});

//setting up the PORT
const PORT = process.env.PORT || 5500;

//starting the server
app.listen(PORT, async () => {
  console.log("Server is starting...");
  await ConnectToDataBase();
  console.log("Server is up and running on PORT : " + PORT);
});
