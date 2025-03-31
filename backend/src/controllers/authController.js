const registrationModel = require("../mongoDb/models/registrationModel");
const bcrypt = require("bcrypt");
const validator = require("validator")
const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken");
const { response } = require("express");

//update user Details
exports.updateUserDetails = async (req, res) => {
    console.log("req.body", req.body)
    try {
        //validationResult 400
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "validation error!",
                response: errors
            })
        }

        //find user
        const user = await registrationModel.findOne({ _id: req.body._id });

        //if user not found!
        if (!user) {
            return res.status(404).json({
                message: "user not found!",
                response: null
            })
        }

        //update the fields provied by user 
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.city = req.body.city || user.city;
        user.contact = req.body.contact || user.contact;
        user.gender = req.body.gender || user.gender;
        user.age = req.body.age || user.age;

        //save document
        const updatedUser = await user.save();
        const { password, confirmPassword, cart, ...filteredDetails } = updatedUser._doc;

        //200 response (user updated)
        return res.status(200).json({
            message: "user updated sucessfully!",
            response: filteredDetails
        })
    } catch (error) {
        //on server error
        return res.status(500).json({
            message: "server error!",
            response: error
        })
    }
}

// userAddress controller
exports.insertUserAddress = async (req, res) => {
    const { user_id, addresses } = req.body;
    console.log(addresses)
    try {
        //check for validation errors 
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ message: "Validation error!", response: errors });

        //search user
        const user = await registrationModel.findById({ _id: user_id });

        if (!user) //on 404 user not found
            return res.status(404).json({ message: "User not found!", response: null });

        user.addresses = addresses || user.addresses; //insert addresess array
        const updatedAddresses = await user.save();

        return res.status(200).json({
            message: "Addresses registered successfully!",
            response: {
                updatedAddresses: updatedAddresses.addresses
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "server error", response: error })
    }
}

// verify Token
exports.verifyAuthToken = async (req, res) => {
    const token = req.headers.token?.split(" ")[1]

    //if token missing
    if (!token)
        return res.status(400).json({ message: "Missing Authentication token!", response: null })

    try {
        //verify jwt token
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET_CODE);

        //find token data from db
        const user = await registrationModel.findById({ _id: decodedUser.userId })
        if (!user) {
            return res.status(404).json({
                isAuthorized: false,
                message: "user not found!",
                response: null
            })
        }

        const { password, ...filteredDetails } = user._doc;
        return res.status(200).json({
            isAuthorized: true,
            message: "user authorized!",
            response: filteredDetails
        })

    } catch (error) {
        //on jwt error wrong token or not found
        if (error.name === "JsonWebTokenError" || "TokenExpiredError") {
            return res.status(401).json({ message: error.name, response: error.message, isAuthorized: false })
        }

        return res.status(500).json({ message: "server error", response: null })
    }

}

// registration route logic
exports.registration = async (req, res) => {
    const userEmail = req.body.email;

    try {
        // Check for validation errors from express-validator
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ message: "validation errors", response: errors })

        //check if user already exists
        const isUserExists = await registrationModel.findOne({ email: userEmail })
        if (isUserExists)
            return res.status(409).json({ message: "email already exists!", response: null })

        //create and save document
        const registeredData = new registrationModel(req.body)
        const result = await registeredData.save()

        const { password, ...filteredDetails } = result._doc;
        console.log("filtered details", filteredDetails)

        //generate jwt token
        const token = await result.generateToken()

        //response send
        res.cookie("jwt", token, {
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000,
            domain: process.env.COOKIE_DOMAIN
        }) // expire in 1 hour
        return res.status(200).json({
            message: "account registered successfully!",
            request: "accepted!",
            response: filteredDetails
        })
    } catch (error) {
        //in case of server errors    
        return res.status(500).json({ message: error.name || "server error!", error: error })
    }
}


//login route logic
exports.login = async (req, res) => {
    console.log(req.body)
    const inputEmail = req.body.email;
    const inputPassword = req.body.password;

    try {
        // Check for validation errors from express-validator
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ message: "validation error!", response: errors })

        //finding query
        const response = await registrationModel.findOne({ email: inputEmail })

        //if account not exist
        if (!response) {
            return res.status(404).json({
                message: "user not found!",
                response: null
            })
        }

        //destructure response
        const { password, ...filteredDetails } = response._doc;
        console.log("filtered details", filteredDetails)

        //check if password is correct
        console.log(inputPassword)
        console.log(response.password)
        const passwordCheck = await bcrypt.compare(inputPassword, response.password)
        console.log(passwordCheck)
        if (passwordCheck) {
            //if password correct
            //gen token
            const token = await response.generateToken();

            //if accound found on mongo
            res.cookie("jwt", token, {
                secure: true,
                sameSite: "none",
                maxAge: 60 * 60 * 1000,
                domain: process.env.COOKIE_DOMAIN
            }) // expire in 1 hour
            return res.status(200).json({
                message: "user logged in!",
                response: filteredDetails
            })

        } else {
            //when password wrong
            return res.status(401).json({
                message: "incorrect credientials!",
                response: "account login failed!"
            })
        }
    } catch (error) {
        //in case of server or network errors
        return res.status(500).json({
            message: "server error!",
            error: error
        })
    }
}