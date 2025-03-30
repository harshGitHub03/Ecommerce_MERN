const jwt = require("jsonwebtoken");

//To verify Token before cart queries
exports.cartAuthToken = (req, res, next) => {
    const token = req.headers.token?.split(" ")[1];

    //if token *not found* or *header not starts with Bearer*
    if (!token || !req.headers.token.startsWith("Bearer "))
        return res.status(401).json({ message: "Missing or malformed Authentication token!", response: null })

    try {
        //verify token
        const isValid = jwt.verify(token, process.env.JWT_SECRET_CODE)

        //if token varied, next
        next();
    } catch (er) {
        //res if token Expired or inValid
        res.status(401).json({ message: er.name, response: er.message, isAuthenticated: false })
    }
}