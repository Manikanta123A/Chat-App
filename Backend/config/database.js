import mongoose from "mongoose";

const connectDb = async ()=>{
    await mongoose.connect(process.env.MONGO_URL) .then ( () =>{
        console.log("Connected to the database")
    }).catch(()=>{console.log("Error in connecting to the database")})
}

export default connectDb;