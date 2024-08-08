import mongoose from 'mongoose';

const bookedItemSchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    packageName: { type: String, required: true },
    packageImages: { type: [String], required: true },
    packageRating: { type: Number, required: true },
    packagePrice: { type: Number, required: true },
    hotelName: { type: String, required: true },
    hotelAddress: { type: String, required: true },
    hotelRating: { type: Number, required: true },
    hotelImages: { type: [String], required: true },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    bookedItems: [bookedItemSchema],
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
