// models/Admin.js
import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['super', 'approver', 'register', 'stationOwner'], 
    required: true,
  },
  stationIds: [{ type: Schema.Types.ObjectId, ref: 'FuelStock' }], 
  createdAt: { type: Date, default: Date.now },
});

export default model('Admin', adminSchema);
