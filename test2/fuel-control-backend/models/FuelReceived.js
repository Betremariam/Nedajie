import { Schema, model } from "mongoose";

const fuelReceivedSchema = new Schema(
  {
    station: { type: Schema.Types.ObjectId, ref: "FuelStock", required: true },
    stationName: { type: String, required: true }, 
    city: { type: String, required: true },        
    gasType: { type: String, enum: ["benzene", "diesel"], required: true },
    liters: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("FuelReceived", fuelReceivedSchema);
