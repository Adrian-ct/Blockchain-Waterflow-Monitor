import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 254,
    trim: true,
    lowercase: true,
    match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 15,
    match: /^\d{10,15}$/,
  },
  avatar: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
export default Contact;
