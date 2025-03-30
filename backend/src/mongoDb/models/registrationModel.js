const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { type } = require("os");

const registrationSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        validate: (userInput) => {
            if (!validator.isEmail(userInput))
                throw new Error("Invalid email format. Please enter a valid email!")
        }
    },
    password: {
        type: String,
        require: true
    },
    //confirm password should not be the part of schema, as will not be saved in mongo db
    // confirmPassword: {
    //     type: String,
    //     require: true
    // },
    city: { type: String, },
    contact: { type: Number, min: 9 },
    age: { type: Number },
    gender: { type: String, enum: ["None", "Male", "Female", "Other"] },
    addresses: {
        type: [String],
        default: []
    },
    cart: [{
        product_id: {
            type: Number,
            require: true
        },
        quantity: {
            type: Number,
            require: true
        },
        price: {
            type: Number,
            require: true
        }
    }]
})


//create jwt token
registrationSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
        }, process.env.JWT_SECRET_CODE);
    } catch (error) {
        console.error(error)
    }
};

//bcrypt hash password!
registrationSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password =await bcrypt.hash(this.password, parseInt(process.env.BCRYPT_HASH_ROUNDS))
    }
    next();
})

const registrationModel = new mongoose.model("registration", registrationSchema);

module.exports = registrationModel;