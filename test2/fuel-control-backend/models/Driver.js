import { Schema, model } from "mongoose";

const driverSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  carType: { type: String, enum: ["bajaj", "taxi", "heavy"], required: true },
  carPlate: { type: String, required: true },
  qrCode: { type: String }, 
  password: { type: String, required: true },
  dailyLimitUsed: { type: Number, default: 0 },
  lastFuelDate: { type: Date },
  isApproved: {
    type: Boolean,
    default: false, 
  },
  documentPath: { type: String },
  approvedBy: {
    type:Schema.Types.ObjectId,
    ref: "Admin"
  }
}, { timestamps: true });

export default model("Driver", driverSchema);
