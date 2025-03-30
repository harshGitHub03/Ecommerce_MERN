const { body } = require("express-validator");

exports.validateContactForm=[
    body("name").trim().notEmpty().withMessage("Name field cannot be empty.").bail()
    .isLength({min:3}).withMessage("Name field must contains 3 characters."),

    body("email").trim().notEmpty().withMessage("Name field cannot be empty.").bail()
    .isEmail().withMessage("Email must be valid."),

    body("subject").trim().notEmpty().withMessage("Subject field Cannot be empty.").bail()
    .isLength({min:3}).withMessage("Subject field must contains 3 characters."),

    body("message").trim().notEmpty().withMessage("Message field cannot be empty.").bail()
    .isLength({min:3}).withMessage("Subject field must contains 3 characters."),

]