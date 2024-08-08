// models/PackageModel.js
import mongoose from 'mongoose';


const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);
const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  days: { type: Number, required: true },
  images: [{ type: String }],
  schedule: [
    {
      day: { type: Number, required: true },
      description: { type: String, required: true }
    }
  ],

  numReviews: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },

},{timestamps:true});

const Package = mongoose.model('Package', packageSchema);

export default Package;
