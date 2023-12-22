const CartModel = require("../../../DataBase/Models/CartModel");
const OrderModel = require("../../../DataBase/Models/OrderModel");
const AuthUtils = require("./../../../Utils/AuthUtils");
const ClientUploadRoute = require("express").Router();
const sendEmail = require("../../../Utils/EmailSender");
const stripe = require('stripe')("sk_test_51OBBNrSCHCgq5ZNZJrzPCuZA9SdlAmjyWdx4orDFKAtKIctHqv8baaovNRlOpvtLpnX9cc0mk6xHF3pkXFMNW13700kwixuFSz")



ClientUploadRoute.post("/add-to-cart", async (req, res) => {
  try {
    const customer = await AuthUtils.decodeToken(req.body.token);

    //check for already existance

    const PrevCartData = await CartModel.findOne({
      customer: customer.user_id,
    });

    if (PrevCartData) {
      let itemExists = false;
      PrevCartData.product.forEach((item) => {
        if (item == req.body.productID.ProductID) {
          itemExists = true;
          res.json({
            message: "Item already exists",
          });
        }
      });

      if (!itemExists) {
        PrevCartData.product.push(req.body.productID.ProductID);
        await PrevCartData.save();
        res.json({
          message: "OK",
        });
      }
    } else {
      const CurrentItem = new CartModel({
        product: req.body.productID.ProductID,
        customer: customer.user_id,
      });

      await CurrentItem.save();
      res.json({
        message: "OK",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      message: "error",
      error: error,
    });
  }
});

ClientUploadRoute.post("/place-order", async (req, res) => {
  try {
    const token = req.body.token;
    const decodedToken = await AuthUtils.decodeToken(token);
    const customerID = decodedToken.user_id;

    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const products = req.body.products;

    const formattedProducts = [];

    products.map(item =>{
      formattedProducts.push(
        {
          product : item.productID,
          Qty : item.Qty
        }
      )
    })

    const CurrentOrder = new OrderModel({
      products: formattedProducts,
      customer: customerID,
      OrderPrice: req.body.OrderPrice,
      Delivered: false,
      Paid: false,
      OrderConfirmed : false,
      OrderStatus: "Order Requested",
      createdAt: formattedDate,
      ExpectedDeliveryDate : "",
    });
    await CurrentOrder.save();

    await CartModel.deleteOne({
      customer: customerID,
    });

    //sending mail to owner
    await sendEmail(
      process.env.OWNER,
      "New Order",
      `
    Dear Ziventa Owner,

    I hope this message finds you well. We wanted to inform you that we have received a new order on our platform. Here are the details of the order:


Customer Name: ${decodedToken.username}
Order Date: ${formattedDate}
Order Total: ₹ ${req.body.OrderPrice}

Please log in to your Ziventa account to view the order details and take the necessary actions to process it.

Thank you for your continued support, and we look forward to fulfilling this order promptly.

Best regards,
Team Ziventa
`
    );

    res.json({
      message: "OK",
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "error",
      error: error,
    });
  }
});

ClientUploadRoute.post('/checkout-payment', async(req,res)=>{
  
 try{
  const products = req.body.products;
  const lineItems = products.map(item=>{
    return {
      price_data : {
        currency:"inr",
        product_data:{
          name:item.name
        },
        unit_amount:(item.price)*100
      },
      quantity:item.Qty
    }
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types : ["card"],
    mode:"payment",
    line_items: lineItems,
    success_url : "https://ziventa-client.vercel.app/profile",
    cancel_url : "https://ziventa-client.vercel.app/products"
  })


  res.json({id:session.id})
 }
 catch(error){
  console.error(error);
  res.json({
    message : "error",
    error : error
  })
 }
})

module.exports = ClientUploadRoute;
