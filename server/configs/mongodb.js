import mongoose from "mongoose";

const ConnectDb = async () => {
    try {
       
        mongoose.connection.on("connected", () => {
            console.log(" Successfully connected to MongoDB Atlas");
        });

        mongoose.connection.on("error", (err) => {
            console.error( err);
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/lms`);

    } catch (error) {
        console.error( error.message);
        process.exit(1); 
    }
};

export default ConnectDb;