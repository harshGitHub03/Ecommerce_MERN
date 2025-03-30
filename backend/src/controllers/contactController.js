const { validationResult } = require("express-validator");
const contactModel = require("../mongoDb/models/contactModel")

exports.contactFormController = async (req, res) => {
    try {
        //check for validations errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "validation errors!",
                errors:errors
            })
        }

        //insert contact data
        const response = await contactModel.insertOne(req.body);

        //response 200
        return res.status(200).json({ message: "Your contact is registered successfully!", response: response })
    } catch (error) {
        return res.status(500).json({ message: "Server error!", errors: error });
    }
}