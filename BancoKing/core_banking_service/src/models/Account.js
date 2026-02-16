import { Schema, model } from 'mongoose';

const accountSchema = new Schema({
    userId: { type: String, required: true },
    accountNumber: { type: String, unique: true, required: true },
    type: { type: String, enum: ['monetary', 'savings'], default: 'savings' },
    balance: { type: Number, default: 0, min: 0 }, 
    currency: { type: String, default: 'USD' }
}, { timestamps: true });

export default model('Account', accountSchema);

// Modelo aun en proceso...