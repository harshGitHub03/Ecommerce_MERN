const express = require("express");
const router = express.Router()

//requires controllers and validations
const { registration, login, verifyAuthToken, updateUserDetails, insertUserAddress } = require("../controllers/authController")
const { validateRegistration, validateLogin, validateUpdateUserDetails, validateUserAddress } = require("../middlewares/validation/validationMiddleware")

router.post("/registration", validateRegistration, registration)
router.post("/login", validateLogin, login)

//verify auth token
router.post("/verifyToken", verifyAuthToken)

//update user
router.put("/updateDetails", validateUpdateUserDetails, updateUserDetails)
router.post("/insertUserAddress",validateUserAddress,insertUserAddress)

module.exports = router;