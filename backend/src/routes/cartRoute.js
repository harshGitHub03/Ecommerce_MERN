const express = require("express")
const router = express.Router()

//requires
const cartController = require("../controllers/cartControllers");
const { validateIncrementProduct, validateAddProduct, validateRemoveProduct, validateDecreaseProduct } = require("../middlewares/validation/cartValidationMiddleware");
const { cartAuthToken } = require("../middlewares/VerifyAuthToken/cartAuthToken")

//routes
router.post("/addItem/",cartAuthToken, validateAddProduct, cartController.addToCart);
router.delete("/removeItem/",cartAuthToken, validateRemoveProduct, cartController.removeFromCart)
router.put("/incrementItem/",cartAuthToken, validateIncrementProduct, cartController.increaseQuantity)
router.put("/decrementItem/",cartAuthToken, validateDecreaseProduct, cartController.decreaseQuantity)

module.exports = router;