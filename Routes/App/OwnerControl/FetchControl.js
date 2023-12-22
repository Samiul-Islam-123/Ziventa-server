const FetchControlRoute = require('express').Router();
const OrderModel = require('../../../DataBase/Models/OrderModel');
const ProductModel = require('../../../DataBase/Models/ProductModel');
const AuthUtils = require('../../../Utils/AuthUtils')

FetchControlRoute.get('/all-products', async(req,res)=>{
    const RequestHeader = req.headers.authorization;
    if(RequestHeader && RequestHeader.startsWith('Bearer')){
        try{
            const token = RequestHeader.slice(7);// remove Bearer
            const DecodedToken = await AuthUtils.decodeToken(token);
            const Products = await ProductModel.find({
                ProductOwner : DecodedToken.user_id
            })
    
            res.json({
                message : "OK",
                products : Products
            })
        }
        catch(error){
            console.error(error);
            res.json({
                message : "ERROR",
                error : error
            })
        }
    }
    else{
        res.json({
            message : "Unauthorized"
        })
    }
})

FetchControlRoute.get('/orders', async(req,res)=>{
    try{
        const Orders = await OrderModel.find().populate('products.product');
        if(Orders)
        {
            res.json({
                success:true,
                Orders : Orders
            })
        }
        else{
            res.json({
                success: true,
                message : "No Orders yet"
            })
        }
    }
    catch(error){
        console.error(error)
        res.json({
            success : false,
            message : "Error occured",
            error : error
        })
    }
})


module.exports = FetchControlRoute;