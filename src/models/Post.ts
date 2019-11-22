import {  Schema, model, Document } from "mongoose";

//schema
const schema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    cover: {type: String, required: true},
    covername: {type: String, required: true}
});


//post interface
interface IPost extends Document {
    title: string,
    content: string,
    cover: string,
    covername: string
}

export default model<IPost>("Post", schema);
