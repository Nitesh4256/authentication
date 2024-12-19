import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connection successfully");
  } catch (error) {
    console.log("error in conection datatbase");
    console.log(error);
  }
};

export default connectDB;
