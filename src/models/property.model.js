import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Property schema
const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        description: { type: String },
      },
    ],
    host: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    availability: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
      },
    ],
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ]
  },
  {
    timestamps: true,
  }
);

// Create and export the Property model
const Property = mongoose.model('Property', propertySchema);
export default Property;
