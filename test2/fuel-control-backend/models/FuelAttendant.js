import { Schema, model } from "mongoose";

const fuelAttendantSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stationName: { type: String, required: true },
  city: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  documentPath: { type: String, required: true },
}, { timestamps: true });

export default model("FuelAttendant", fuelAttendantSchema);
