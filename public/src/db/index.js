import mongoose from 'mongoose';
import {Db_name} from "../constants.js";
console.log(process.env.MONGODB_URI);

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect
        (`mongodb+srv://shivam05:Mishra010405@cluster0.3nlkglu.mongodb.net/${Db_name}`)
        console.log(`\n Mongodb connceted !!    DB Host : ${
            connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB Connection FAILED", error);
        process.exit(1);
    } 
}

export default connectDb