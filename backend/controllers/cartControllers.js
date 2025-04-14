import User from "../models/userModel.js";
import Product from "../models/productModel.js";

const addToCart = async (req, res) => {
    try {
        const {userId , itemId , size} = req.body
        
        const userData  = await User.findById(userId)
        let cartData = await userData.cartData
        if (cartData[itemId]) {
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1
            }else{
                cartData[itemId][size] = 1
            }
        }else{
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        await User.findByIdAndUpdate(userId , {cartData})
        return res.status(200).json({success : true , message : "Product added to cart"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success : false , message : "Something went wrong"})   
        
    }

}
const updateCart = async (req, res) => {
    try {
        const {userId , itemId , size , quantity} = req.body
        const userData  = await User.findById(userId)
        let cartData = await userData.cartData


        cartData[itemId][size] = quantity
        await User.findByIdAndUpdate(userId , {cartData})
        return res.status(200).json({success : true , message : "Cart updated"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success : false , message : "Something went wrong"})
        
    }

}
const getCart = async (req, res) => {
    try {
        const {userId} = req.body
        const userData  = await User.findById(userId)
        const cartData = await userData.cartData
        return res.status(200).json({success : true , message : "Cart fetched" , cartData})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success : false , message : "Something went wrong"})
        
    }
}

export { addToCart, updateCart, getCart }