import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  alias: {
    type: String,
    required: true,
    unique: true,
  },
});

const Device =
  mongoose.models.Account || mongoose.model("Account", DeviceSchema);
export default Device;
