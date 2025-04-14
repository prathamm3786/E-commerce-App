import mongoose from "mongoose";
import "dotenv/config"

const connectDB = async () => {
    try {
        mongoose.connection.on("connected",()=>{
            console.log(`connected to mongoDB`)
        } )
        await mongoose.connect(process.env.MONGO_URI)
        
    } catch (error) {
        console.log(error)
    }
}

export default connectDB