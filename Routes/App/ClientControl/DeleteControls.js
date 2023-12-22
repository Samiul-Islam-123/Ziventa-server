const CartModel = require("../../../DataBase/Models/CartModel");
const AuthUtils = require("../../../Utils/AuthUtils");
const ClientDeleteControlRoute = require("express").Router();
const OrderModel = require("./../../../DataBase/Models/OrderModel");
const sendEmail = require("../../../Utils/EmailSender");

ClientDeleteControlRoute.post("/remove-item", async (req, res) => {
  try {
    const productID = req.body.productID;
    const token = req.body.token;

    const decodedToken = await AuthUtils.decodeToken(token);
    const customerID = decodedToken.user_id;

    // Find the cart for the customer
    const cart = await CartModel.findOne({
      customer: customerID,
    });

    if (!cart) {
      return res.json({
        message: "Cart not found",
      });
    }

    // Use $pull to remove the specified product ID from the product array
    const updatedCart = await CartModel.findOneAndUpdate(
      {
        customer: customerID,
      },
      {
        $pull: { product: productID },
      },
      { new: true }
    );

    res.json({
      message: "OK",
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "Error removing product from cart",
      error: error,
    });
  }
});

ClientDeleteControlRoute.post("/remove-order-item", async (req, res) => {
  try {
    const token = req.body.token;
    const decodedToken = await AuthUtils.decodeToken(token);
    const orderID = req.body.orderID;
    const productID = req.body.productID;
    
    // Use $pull to remove the specified product ID from the product array
    const updatedOrder = await OrderModel.findOneAndUpdate(
      {
        _id: orderID,
      },
      {
        $pull: { products: { product: productID } },
      },
      { new: true }
      );
      
      if (updatedOrder) {
        //updating Price
        const CurrentOrder = await OrderModel.findOne({
          _id: orderID,
        }).populate("products.product");
        
        if (CurrentOrder) {

          if(CurrentOrder.OrderPrice == 0)
          {
            res.json({
              message : "No Orders found"
            })
          }

          else{
            
            let TotalPrice = 0;
            CurrentOrder.products.forEach((item) => {
            TotalPrice += item.Qty * item.product.ProductPrice;
          });
         
          CurrentOrder.OrderPrice = TotalPrice;
  
          await CurrentOrder.save();
          }

      } else {
        res.json({
          message: "Order not found",
        });
      }

      //sending email to owner
      await sendEmail(
        process.env.OWNER,
        "Item Cancelled",
        `
      Dear Ziventa Owner,
  
      We regret to inform you that an item on our platform has been canceled. Here are the details of the canceled item:

  Customer Name: ${decodedToken.username}
 
  The customer has decided to cancel their order. Please make the necessary adjustments to your records and inventory.

  We appreciate your understanding and continued support. Thank you for being a part of Ziventa.

  Best regards,
  Team Ziventa
  `
      );

      res.json({
        message: "OK",
      });
    } else {
      res.json({
        message: "Order not found or product not found in the order.",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      message: "Error removing product from cart",
      error: error,
    });
  }
});

module.exports = ClientDeleteControlRoute;
