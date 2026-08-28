import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed  -------->>  ", error.message);
    console.log("DB URL ->", process.env.DATABASE_URL);

    process.exit(1);
  }
};

export default connectDB;