import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['super', 'approver', 'register'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('Admin', adminSchema);

