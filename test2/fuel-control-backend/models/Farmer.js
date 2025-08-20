import { Schema, model } from 'mongoose';

const farmerSchema = new Schema({
  fullName: { type: String, required: true },
  kebele: { type: String, required: true },
  woreda: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  documentPath: { type: String },
  approvedBy: {
  type: Schema.Types.ObjectId,
  ref: "Admin" 
}, 
  isApproved: {
    type: Boolean,
    default: false
  },
  
  createdAt: { type: Date, default: Date.now }
});

export default model('Farmer', farmerSchema);
