import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://av874559:17yoJBhGQDM6WolC@cluster0.gkujoei.mongodb.net/ender_db?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
            console.log("MongoDB connected successfully");
        })
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
}
export default connectDB;