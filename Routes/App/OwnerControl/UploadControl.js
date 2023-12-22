const ProductModel = require("../../../DataBase/Models/ProductModel");
const UploadControlRouter = require("express").Router();
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const fs = require("fs");
const keyFilename = "./credentials.json";
const AuthUtils = require("./../../../Utils/AuthUtils");
const OrderModel = require("../../../DataBase/Models/OrderModel");
const sendEmail = require('../../../Utils/EmailSender')

// Create a new instance of the Google Cloud Storage client
const storage = new Storage({ keyFilename });

// Configure multer for file upload
const upload = multer({ dest: "uploads/" });

const MAX_FILES = 10;

UploadControlRouter.post(
  "/upload-product",
  upload.array("files", MAX_FILES),
  async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided." });
    }

    try {
      const bucketName = "staging.ultra-bearing-331411.appspot.com"; // Replace with your bucket name
      const bucket = storage.bucket(bucketName);

      const uploadedFiles = [];

      for (const file of req.files) {
        const blob = bucket.file(`Products/${file.originalname}`);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        blobStream.on("error", (err) => {
          console.error("Error uploading file to Google Cloud Storage:", err);
          return res
            .status(500)
            .json({ error: "Error uploading one or more files." });
        });

        blobStream.on("finish", async () => {
          // Store the uploaded file's URL
          const url = `https://storage.googleapis.com/${bucketName}/Products/${file.originalname}`;
          uploadedFiles.push(url);

          // Delete the temporarily stored file
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });

          // Check if all files have been uploaded
          if (uploadedFiles.length === req.files.length) {
            const ProductData = JSON.parse(req.body.productData);
            const token = ProductData.token;
            const DecodedToken = await AuthUtils.decodeToken(token);
            const CurrentProduct = new ProductModel({
              ProductOwner: DecodedToken.user_id,
              ProductTitle: ProductData.ProductTitle,
              ProductDescription: ProductData.ProductDescription,
              ProductImages: uploadedFiles,
              ProductPrice: ProductData.ProductPrice,
              ProductStock: ProductData.ProductStock,
              ProductMetaData: {
                AgeRange: ProductData.AgeRange,
                Category: ProductData.Category,
              },
            });

            await CurrentProduct.save();

            return res.json({ message: "OK" });
          }
        });

        // Pipe the local file to the Google Cloud Storage object
        fs.createReadStream(file.path).pipe(blobStream);
      }
    } catch (error) {
      console.error(error);
      res.json({
        message: "error",
        error: error,
      });
    }
  }
);

UploadControlRouter.post("/confirm-order", async (req, res) => {
  try {
    const CurrentOrder = await OrderModel.findOne({
      _id: req.body.orderID,
    }).populate('customer');
    //console.log(CurrentOrder)
    if (CurrentOrder) {
      //const decodedToken = await AuthUtils.decodeToken(req.body.token);
      //update OrderStatus
      CurrentOrder.OrderStatus = "Order Confirmed";
      CurrentOrder.ExpectedDeliveryDate = req.body.ExpectedDeliveryDate;
      await CurrentOrder.save();
      //sending email to customer
      await sendEmail(
        CurrentOrder.customer.email,
        "Order Confirmed",
        `
       Dear ${CurrentOrder.customer.username},

       We are delighted to inform you that your order with us has been successfully confirmed. Thank you for choosing Ziventa!

        Order Details:

        Order ID: ${CurrentOrder._id}
        Order Total: ${CurrentOrder.OrderPrice}
        Delivery Date: ${req.body.ExpectedDeliveryDate}

        We want to assure you that our team is working diligently to process and dispatch your order at the earliest. You can expect your package to be delivered by req.body.ExpectedDeliveryDate. If there are any changes or updates to your order, we will keep you informed.
        Thank you for choosing Ziventa! 

Best Regards,

Team Ziventa
   `);

   res.json({
    message : "OK"
   })
    } else {
      res.json({
        message: "Order not found",
      });
    }
  } catch (error) {
    console.log(error)
    res.json({
      message: "error",
      error: error,
    });
  }
});

UploadControlRouter.post('/deliver-order', async(req,res)=>{
  try {
    const CurrentOrder = await OrderModel.findOne({
      _id: req.body.orderID,
    }).populate('customer');
    //console.log(CurrentOrder)
    if (CurrentOrder) {
      //const decodedToken = await AuthUtils.decodeToken(req.body.token);
      //update OrderStatus
      CurrentOrder.OrderStatus = "Order Delivered";
      await CurrentOrder.save();
      //sending email to customer
      await sendEmail(
        CurrentOrder.customer.email,
        " Order Delivered 🎉",
        `
       Dear ${CurrentOrder.customer.username},

       We are delighted to inform you that your order with us has been successfully delivered. Thank you for choosing Ziventa!

        Order Details:

        Order ID: ${CurrentOrder._id}
        Order Total: ${CurrentOrder.OrderPrice}
        Delivery Date: ${req.body.ExpectedDeliveryDate}

Best Regards,

Team Ziventa
   `);

   res.json({
    message : "OK"
   })
    } else {
      res.json({
        message: "Order not found",
      });
    }
  } catch (error) {
    console.log(error)
    res.json({
      message: "error",
      error: error,
    });
  }
})

UploadControlRouter.post('/update-data',async(req,res)=>{
  try{
    let productCount = 0, OrderCount = 0, delivered = 0;
    const ProductsData = await ProductModel.find({})
    if(ProductsData)
    productCount = ProductsData.length;
  
    const orderData = await OrderModel.find({});
    if(orderData)
    {
      OrderCount = orderData.length;
      orderData.map(item=>{
       if(item.OrderStatus === "Order Delivered")
       delivered++;
      })
    }
  
    res.json({
      message : "OK",
      orderCount : OrderCount,
      productCount : productCount,
      deliveredCount : delivered
    })
  }
  catch(error){
    console.error(error)
    res.json({
      message : "error"
    })
  }

})

module.exports = UploadControlRouter;
