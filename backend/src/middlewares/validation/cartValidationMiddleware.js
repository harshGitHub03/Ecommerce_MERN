const { body } = require("express-validator")
const mongoose = require("mongoose")

//validate add to cart
exports.validateAddProduct = [
    body("user_id").notEmpty().withMessage("User id is a required field!")
        .bail()// Stop validation chain if notEmpty fails
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value))
                throw new Error("User id must be valid!")
            return true
        }),

    body("product_id").notEmpty().withMessage("product id must required!")
        .bail()// Stop validation chain if notEmpty fails
        .isNumeric().withMessage("Product id must be numeric and requried!"),

    body("quantity").notEmpty().withMessage("quantity is a required field")
        .bail()// Stop validation chain if notEmpty fails
        .custom((value) => {
            if (value < 0)
                throw new Error("quantity cannot be less then 0!")
            return true
        }),

    body("price").notEmpty().withMessage("price is a required field")
        .bail()// Stop validation chain if notEmpty fails
        .custom((value) => {
            if (value < 0)
                throw new Error("price cannot be less then 0!")
            return true
        }),
]

//validate remove from cart
exports.validateRemoveProduct = [
    body("user_id").notEmpty().withMessage("User id is a required field!")
        .bail()// Stop validation chain if notEmpty fails
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value))
                throw new Error("User id must be valid!")
            return true
        }),

    body("product_id").notEmpty().withMessage("product id field is required!")
        .bail()// Stop validation chain if notEmpty fails
        .isNumeric().withMessage("Product id must be numeric"),
]

//validate increment product
exports.validateIncrementProduct = [
    body("user_id").notEmpty().withMessage("user id field is required!")
        .bail()// Stop validation chain if notEmpty fails
        .custom((value) => {
            //check id user_id is valid objectID *_id*
            if (!mongoose.Types.ObjectId.isValid(value))
                return false
            return true
        }).withMessage("invalid userID"),

    body("product_id").notEmpty().withMessage("product id field is required!")
        .bail()// Stop validation chain if notEmpty fails
        .isNumeric().withMessage("Product id must be numeric"),

    body("quantity").notEmpty().withMessage("quantity is a required field")
        .bail()// Stop validation chain if notEmpty fails
        .custom((value) => {
            if (value < 0)
                throw new Error("quantity cannot be less then 0!")
            return true
        }),
]

//validate decrease product 
exports.validateDecreaseProduct = [
    body("user_id").notEmpty().withMessage("user id field is required!")
        .bail()// Stop validation chain if notEmpty fails
        .custom((value) => {
            //check id user_id is valid objectID *_id*
            if (!mongoose.Types.ObjectId.isValid(value))
                return false
            return true
        }).withMessage("invalid userID"),

    body("product_id").notEmpty().withMessage("product id field is required!")
        .bail()// Stop validation chain if notEmpty fails
        .isNumeric().withMessage("Product id must be numeric"),

    body("quantity").notEmpty().withMessage("quantity is a required field")
        .bail()// Stop validation chain if notEmpty fails
        .custom((value) => {
            if (value < 0)
                throw new Error("quantity cannot be less then 0!")
            return true
        }),
]