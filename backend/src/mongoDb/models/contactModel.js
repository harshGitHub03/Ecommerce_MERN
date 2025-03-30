const mongoose = require("mongoose");
const validator = require("validator")

const contactSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        validate: (input) => {
            if (!validator.isEmail(input))
                throw new Error("invalid email!")
        }
    },
    subject: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    }
})

const contactModel=new mongoose.model("contact",contactSchema);

module.exports=contactModel;