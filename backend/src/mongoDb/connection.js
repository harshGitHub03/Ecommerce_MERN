const mongoose=require("mongoose");

mongoose.connect(process.env.Mongoose_connect_url)
.then(()=>console.log("connected to mongoose!"))
.catch((er)=>console.log("error connecting to mongoose!"))