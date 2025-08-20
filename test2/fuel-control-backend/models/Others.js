// models/OtherUser.js

import { Schema, model } from 'mongoose';

const otherUserSchema = new Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  fuelType: { type: String, enum: ['benzene', 'diesel'], required: true },
  dailyLimitUsed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  documentPath: { type: String },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: "Admin" }, 
});

export default model('OtherUser', otherUserSchema);
