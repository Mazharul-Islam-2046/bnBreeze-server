import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";




const connectDB = async () => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MongoDB_URI}/${DB_NAME}`)
        console.log("MongoDB Connected!!!!");

    }catch(err){
        console.error(err)
        process.exit(1)
    }
}


export default connectDB