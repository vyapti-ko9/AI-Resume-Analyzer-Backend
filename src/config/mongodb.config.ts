import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = "mongodb://localhost:27017/Vyapti"
    await mongoose.connect(process.env.MONGO_URI as string || uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Database connection error", error);
    process.exit(1);
  }
};