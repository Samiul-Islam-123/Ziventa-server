const ClientFetchControlRoute = require("express").Router();
const CartModel = require("../../../DataBase/Models/CartModel");
const OrderModel = require("../../../DataBase/Models/OrderModel");
const ProductModel = require("../../../DataBase/Models/ProductModel");
const AuthUtils = require("./../../../Utils/AuthUtils");

//route to get all products
ClientFetchControlRoute.get("/all-products", async (req, res) => {
  const RequestHeader = req.headers.authorization;

  try {
    const Products = await ProductModel.find();

    res.json({
      message: "OK",
      products: Products,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "ERROR",
      error: error,
    });
  }
});

ClientFetchControlRoute.get("/products/:category", async (req, res) => {
  try {
    const Products = await ProductModel.find({
      "ProductMetaData.Category": new RegExp(req.params.category, 'i')
    });

    res.json({
      message: "OK",
      products: Products,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "ERROR",
      error: error,
    });
  }
});

ClientFetchControlRoute.get("/:category/filter/price/high-low", async (req, res) => {
  try {
    const products = await ProductModel.find({
      "ProductMetaData.Category": new RegExp(req.params.category, 'i')
    }).sort({
      ProductPrice : -1//sorting in decending order
    })
    res.json({
      message : "OK",
      products : products
    })
  } catch (error) {
    console.error(error);
    res.json({
      message: "ERROR",
      error: error,
    });
  }
});

ClientFetchControlRoute.get("/:category/filter/price/low-high", async (req, res) => {
  try {
    const products = await ProductModel.find({
      "ProductMetaData.Category": new RegExp(req.params.category, 'i')
    }).sort({
      ProductPrice : 1//sorting in ascending order
    })
    //console.log(products)
    res.json({
      message : "OK",
      products : products
    })
  } catch (error) {
    console.error(error);
    res.json({
      message: "ERROR",
      error: error,
    });
  }
});

ClientFetchControlRoute.get("/:category/filter/rating-first", async (req, res) => {
  try {
    const products = await ProductModel.find({
      "ProductMetaData.Category": new RegExp(req.params.category, 'i')
    }).sort({
      ProductPrice : 1//sorting in ascending order
    })
    //console.log(products)
    res.json({
      message : "OK",
      products : products
    })
  } catch (error) {
    console.error(error);
    res.json({
      message: "ERROR",
      error: error,
    });
  }
});

ClientFetchControlRoute.get("/:category/filter/recent-first", async (req, res) => {
  try {
    //sorting Object Id in descending order to get recent ones at first
    const products = await ProductModel.find({
      "ProductMetaData.Category": new RegExp(req.params.category, 'i')
    })
      .sort({ _id: -1 }) 
      .exec();

    res.json({
      message: "OK",
      products: products,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "ERROR",
      error: error,
    });
  }
});

ClientFetchControlRoute.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query;
    const products =await ProductModel.find({
      ProductTitle : {
        $regex : new RegExp(query, 'i')
      }
    }).exec();
    if(products.length > 0)
    {
      res.json({
        message: "OK",
        products : products
        
      });

    }

    else
    {
      res.json({
        message: "No products found :("
      });
    }
    //console.log(products)
  } catch (error) {
    console.error(error);
    res.json({
      message: "ERROR",
      error: error,
    });
  }
});





//route to get specific product Details
ClientFetchControlRoute.get("/product-details/:productID", async (req, res) => {
  try {
    const ProductDetails = await ProductModel.findOne({
      _id: req.params.productID,
    });

    res.json({
      message: "OK",
      productDetails: ProductDetails,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "ERROR",
      error: error,
    });
  }
});

ClientFetchControlRoute.get("/cart-products", async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      const token = authorizationHeader.slice(7);
      const decodedToken = await AuthUtils.decodeToken(token);
      const CartData = await CartModel.findOne({
        customer: decodedToken.user_id,
      })
        .populate("product")
        .populate("customer");

      if (CartData) {
        res.json({
          message: "OK",
          CartData: CartData,
        });
      } else {
        res.json({
          message: "Nothing in the Cart",
        });
      }
    } else {
      console.log("Invalid (Unsecure token)");
      res.json({
        message: " Invalid Token",
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

ClientFetchControlRoute.get("/order-history/:token", async (req, res) => {
  try {
    const decodedToken = await AuthUtils.decodeToken(req.params.token);
    const OrderData = await OrderModel.find({
      customer: decodedToken.user_id,
    }).populate("products.product");
    if (OrderData) {
      res.json({
        message: "OK",
        OrderData: OrderData,
      });
    } else {
      res.json({
        message: "No Orders yet",
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

ClientFetchControlRoute.get("/badge-values/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = await AuthUtils.decodeToken(token);
    const CartData = await CartModel.findOne({
      customer: decodedToken.user_id,
    });

    let CartItems = 0;
    if (CartData) {
      CartItems = CartData.product.length;
      res.json({
        message: "OK",
        CartItems: CartItems,
      });
    } else {
      res.json({
        message: "OK",
        CartItems: 0,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "error",
      error: error,
    });
  }
});

module.exports = ClientFetchControlRoute;
