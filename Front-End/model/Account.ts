import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  privateKey: {
    type: String,
    required: true,
    unique: true,
  },
});

const Account =
  mongoose.models.Account || mongoose.model("Account", AccountSchema);
export default Account;
