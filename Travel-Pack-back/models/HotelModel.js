// models/hotelModel.js

import mongoose from 'mongoose';

const hotelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Package', // Assuming you have a Place model
    },
    rating: {
      type: Number,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    facilities: [String],
    images: [String],
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
