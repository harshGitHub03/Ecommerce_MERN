const mongoose = require("mongoose")
require("../mongoDb/connection")
// const UserModel = require("../mongoDb/models/registrationModel");
const registrationModel = require("../mongoDb/models/registrationModel");
const { response } = require("express");
const { validationResult } = require("express-validator");

// add to cart
exports.addToCart = async (req, res) => {
    const { user_id, product_id, quantity, price } = req.body;
    console.log(req.body)

    //validate user input / 400 bad request!
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ message: "validation error!", errors: errors })

    try {
        const user = await registrationModel.findById({ _id: user_id })

        //if user not exists
        if (!user) {
            return res.status(404).json({
                message: "user not found!",
                response: null
            })
        }

        //find if product already exists
        const isExists = user.cart.findIndex((item) => item.product_id === product_id)

        //if exists increase quantity
        if (isExists != -1) {
            user.cart[isExists].quantity += quantity
            await user.save()
            return res.status(200).json({ message: "product quantity increased!", response: user.cart[isExists] })
        }

        //push product to user cart
        user.cart.push({
            product_id: product_id,
            quantity: quantity,
            price: price
        })

        await user.save();

        //get new product and send response as added
        const newProduct = user.cart[user.cart.length - 1]
        res.status(200).json({ message: "product added to cart!", response: newProduct })
    } catch (error) {
        res.status(500).json({ message: "server error!", error })
    }
}



//remove from cart
exports.removeFromCart = async (req, res) => {
    const { user_id, product_id } = req.body;

    //validate user input / 400 bad request!
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ message: "validation error!", errors: errors })

    try {
        const user = await registrationModel.findOne({ _id: user_id })
        console.log("01")
        //check if user exists
        if (!user) {
            return res.status(404).json({
                message: "user not found!",
                response: user
            })
        }

        //check if product exists and get index
        const productExist = user.cart.findIndex((item) => item.product_id === product_id)
        //check if product not exists
        if (productExist == -1) {
            return res.status(404).json({
                message: "product dosen't exists",
                response: null
            })
        }

        //store removing product to respond removed product
        const productToRemove = user.cart[productExist];

        //remove product if exists
        user.cart = user.cart.filter((item) => item.product_id != product_id);
        await user.save();
        return res.status(200).json({
            message: "product removed from cart!",
            response: productToRemove
        })
    } catch (error) {
        res.status(500).json({ messge: "server error!", error })
    }
}



//increase quantity 
exports.increaseQuantity = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    console.log(req.body)
    //validate fields through express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ message: "validation errors", response: errors })

    try {
        const user = await registrationModel.findOne({ _id: user_id });
        //check if user exists
        if (!user) {
            return res.status(404).json({ message: "user not found!", response: null })
        }

        //find user index if exists
        const productIndex = user.cart.findIndex(item => item.product_id === product_id);
        //if dosen't exists
        if (productIndex === -1) {
            return res.status(404).json({ message: "product dosen't exists", response: null })
        }

        //increase quantity of product and send res
        user.cart[productIndex].quantity += quantity
        await user.save();
        return res.status(200).json({
            message: "product quantity increased!",
            response: user.cart[productIndex]
        })
    } catch (error) {
        res.status(500).json({
            message: "server error!",
            error: error
        })
    }
}


// decrease quantity 
exports.decreaseQuantity = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    //validate fields through express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ message: "validation errors", response: errors })

    try {
        const user = await registrationModel.findOne({ _id: user_id });
        //check if user exists
        if (!user) {
            return res.status(404).json({ message: "user not found!", response: null })
        }

        //find user index if exists
        const productIndex = user.cart.findIndex(item => item.product_id === product_id);
        //if dosen't exists
        if (productIndex === -1) {
            return res.status(404).json({ message: "product dosen't exists", response: null })
        }

        //decrease quantity of product
        user.cart[productIndex].quantity -= quantity

        //remove product when quantity < 0
        if (user.cart[productIndex].quantity < 1) {
            //getting product to res
            const productToRemove = user.cart[productIndex]

            // remove product
            user.cart = user.cart.filter(item => item.product_id !== product_id)
            await user.save();
            return res.status(200).json({ message: "product removed from cart!", response:productToRemove });
        }

        //save and send res
        await user.save();
        return res.status(200).json({
            message: "product quantity decreased!",
            response: user.cart[productIndex]
        })
    } catch (error) {
        res.status(500).json({
            message: "server error!",
            error: error
        })
    }
}
