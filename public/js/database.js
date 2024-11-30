import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURL =
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";
    await mongoose.connect(mongoURL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
