import { connect } from "mongoose";
import { handle } from "./libs/promiseHandler";


export const connection = async() => {
    let [connection, connectionErr] = await handle(connect(`YOUR_MONGODB_CONNECTION_STRING`, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
    }));

    if(connectionErr){
        throw new Error(connectionErr);
    }else{
        console.log("Connection established!");
    }
}