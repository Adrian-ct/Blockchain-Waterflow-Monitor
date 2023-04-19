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
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Device = mongoose.models.Device || mongoose.model("Device", DeviceSchema);
export default Device;
