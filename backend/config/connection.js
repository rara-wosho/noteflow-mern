import mongoose from "mongoose";

export const connectDB = async () => {
    console.log("MONGO URL: ", process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MONGOOSE CONNECTED SUCCESSFULLY");
    } catch (error) {
        console.error("Database connection error: ", error);
        process.exit(1);
    }
};
