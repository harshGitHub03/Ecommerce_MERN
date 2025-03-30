const express = require("express")
const app = express()
require("dotenv").config(); // To access .env 
const cors = require("cors")

const PORT = parseInt(process.env.PORT) || 2000; //.env stores values in string, as need to parse to get desired type

//require mongoose connection
require("../src/mongoDb/connection")

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

//routes
const contactRoute = require("./routes/contactRoutes")
const authRoutes = require("./routes/authRoute");
const cartRoutes = require("./routes/cartRoute")
app.use("/contact", contactRoute);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);

app.listen(PORT, console.log("listening at port", PORT));