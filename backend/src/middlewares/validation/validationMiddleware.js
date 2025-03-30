const { error } = require("console");
const { body } = require("express-validator");

// insert userAddresses
exports.validateUserAddress = [
    body("addresses").notEmpty().withMessage("Please fill empty fields.").bail()
        .custom((addresses) => { //check addresses array lengths
            if (addresses.length ===0)
                throw new Error("Address cannot be empty!")
            if (addresses.length > 3)
                throw new Error("Address limit of 3 is reached!")
            return true
        }).bail()

        .custom((addresses) => {//check if address are type String
            if (!addresses.every((arr) => typeof (arr) === "string"))// every return true/false after check condition
                throw new Error("Addresses must be type String.")
            return true //else return true
        }).bail()

        .customSanitizer((addresses) => { //sanitizer fuction return sanitized(updated) value and replace original value
            const trimmedAddresses = addresses.map((arr) => arr.trim()) // return new trimmed value array of address
            return trimmedAddresses; //return trimmed address array
        })
]

// update user details
exports.validateUpdateUserDetails = [
    body("name").trim().notEmpty().withMessage("name is required!")
        .bail()
        .isLength({ min: 4 }).withMessage("Name must be at least 4 characters long!"),

    body("email").trim().notEmpty().withMessage("email is a required field!")
        .bail()
        .isEmail().withMessage("Must be a valid email!"),

    body("city").trim().optional({ checkFalsy: true })  // Makes the field optional, allows empty string or undefined
        .bail()
        .isString().withMessage("City should only contain alphabetic characters."),

    body("contact").trim().optional({ checkFalsy: true })  // Makes the field optional, allows empty string or undefined
        .bail()
        .isNumeric().withMessage("Contact number must be numerical.")
        .bail()
        .isLength({ min: 10 }).withMessage("Contact number must be at least 10 digits.")
        .bail()
        .isLength({ max: 15 }).withMessage("Contact number cannot exceed 15 digits."),

    body("gender").trim().optional({ checkFalsy: true })  // Makes the field optional, allows empty string or undefined
        .bail()
        .isIn(["Male", "Female", "Other"]).withMessage("Gender must be within options."),

    body("age").trim().optional({ checkFalsy: true })  // Makes the field optional, allows empty string or undefined
        .bail()
        .isInt({ min: 8, max: 120 }).withMessage("Age must be under 8 to 120.")
]

//express-validator push errors and get in validationResult in registration handler
exports.validateRegistration = [
    body("name").trim().notEmpty().withMessage("Name is required!")
        .bail()
        .isLength({ min: 4 }).withMessage("Name must be at least 4 characters long!"),

    body("email").trim().notEmpty().withMessage("Email is a required field!")
        .bail()
        .isEmail().withMessage("Must be a valid email!"),

    body("password").trim().notEmpty().withMessage("Password is a required field!")
        .bail()
        .isLength({ min: 6 }).withMessage("Password length must be atleast 6 characters!"),

    body("confirmPassword").trim().notEmpty().withMessage("Confirm password is a required field!")
        .bail()
        .isLength({ min: 6 }).withMessage("Confirm password must be atleast 6 characters!")
        .bail()
        .custom((value, { req }) => {
            if (value !== req.body.password)
                throw new Error("Confirm password must match password!")
            return true
        })
];

//express-validator push errors and get in validationResult in login handler
exports.validateLogin = [
    body("email").trim().notEmpty().withMessage("Email is a required field!")
        .bail()
        .isEmail().withMessage("Must be a valid email!"),

    body("password").trim().notEmpty().withMessage("Password is a required field!")
        .bail()
        .isLength({ min: 6 }).withMessage("Password length must be atleast 6 characters!"),
]
