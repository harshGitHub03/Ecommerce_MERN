const express = require("express")
const router = express.Router()

//requires
const { contactFormController } = require("../controllers/contactController")
const { validateContactForm } = require("../middlewares/validation/contactFormValidation")
const { cartAuthToken } = require("../middlewares/VerifyAuthToken/cartAuthToken")

//routes
router.post("", cartAuthToken, validateContactForm, contactFormController)

module.exports = router;