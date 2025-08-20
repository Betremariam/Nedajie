import { Schema, model } from 'mongoose';

const fuelDeliverySchema = new Schema({
  date: {
    type: String,
    required: true
  },
  customer: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  citter: {
    type: String,
    required: true
  },
  fdcNo: {
    type: String,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    enum: ['diesel', 'benzene'], 
    required: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model('FuelDelivery', fuelDeliverySchema);
