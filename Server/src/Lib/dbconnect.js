import mongoose from "mongoose";

export const connectDB = async () =>
{
    try {
        const db = await mongoose.connect(process.env.DB_ConnectionString);
        console.log("DB Connected: ",process.env.DB_ConnectionString)
    } catch (error) 
    {
        console.log("Failed to connect Data Base")
        console.error(error.message);
        process.exit(1);
    }
}

export default connectDB; 