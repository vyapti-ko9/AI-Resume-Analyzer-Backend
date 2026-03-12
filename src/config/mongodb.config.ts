import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI;

    await mongoose.connect(uri as string);

    console.log("MongoDB connected");
    console.log("Connection state:", mongoose.connection.readyState);

  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};