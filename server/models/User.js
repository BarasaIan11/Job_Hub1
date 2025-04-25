import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resume: { type: String },
    image: { type: String, required: false }
},{timestamps : true})

const User = mongoose.model('User',userSchema)

export default User; 