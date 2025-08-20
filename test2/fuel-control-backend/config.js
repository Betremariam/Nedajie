import { connect } from "mongoose";
import { config } from "dotenv";
config();

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Mongo Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
