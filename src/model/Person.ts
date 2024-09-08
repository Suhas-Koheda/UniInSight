import mongoose, { Schema, Document } from 'mongoose';

export interface Person extends Document{
    username:string,
    password:string,
    role:string,
    email:string,
    joinedOn:Date,
}


const PersonSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    joinedOn: { type: Date, required: true },
})


const personModel = (mongoose.models.Person as mongoose.Model<Person>) || mongoose.model<Person>("Person", PersonSchema);
export default personModel;