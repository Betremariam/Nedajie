import { Schema, model } from "mongoose";

const fuelTransactionSchema = new Schema(
  {
    driver: { type: Schema.Types.ObjectId, ref: "Driver", default: null },
    farmer: { type: Schema.Types.ObjectId, ref: "Farmer", default: null },
    otherUser: { type: Schema.Types.ObjectId, ref: "OtherUser", default: null },
    gasType: {
      type: String,
      enum: ["benzene", "diesel"],
      required: true
    },
    liters: {
      type: Number,
      required: true
    },
    stationName: {
      type: String,
      required: true
    },
     attendantName: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

export default model("FuelTransaction", fuelTransactionSchema);
