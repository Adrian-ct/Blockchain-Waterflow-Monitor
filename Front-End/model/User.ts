import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
    minLength: 5,
  },
  privateKey: {
    type: String,
    required: true,
    unique: true,
  },
  publicKey: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
