import { Schema, model } from "mongoose";

const fuelStockSchema = new Schema({
  stationName: { type: String, required: true },
  city: { type: String, required: true },
  gasType: { type: String, enum: ["benzene", "diesel"], required: true },
  litersReceived: { type: Number, required: true },
  litersDispensed: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default model("FuelStock", fuelStockSchema);