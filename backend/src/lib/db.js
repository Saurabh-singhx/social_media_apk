import mongoose from "mongoose"

export const ConnectDB = async () => {

    try{

        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongodb is Connected ${connect.connection.host}`);
    }catch(err){

        console.log("mongodb connection error",err);
    }
};