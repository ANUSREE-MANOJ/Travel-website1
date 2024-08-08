import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';


const createOrder = asyncHandler(async (req, res) => {
  try {
    const { bookedItems, paymentMethod, totalPrice } = req.body;
    
    // Check if there are no booked items
    if (!bookedItems || bookedItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    // Create a new order
    const order = new Order({
      user: req.user._id, // Assuming user is authenticated and user ID is available in req.user
      bookedItems,
      paymentMethod,
      totalPrice,
    });
    // Save the order to the database
    const createdOrder = await order.save();

    // Respond with the created order
    res.status(201).json(createdOrder);
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
});

const getAllOrders = async (req, res) => {
  try {
    // Extract page and limit from query parameters, default to 1 and 2 respectively
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    // Calculate how many items to skip
    const skip = (page - 1) * limit;

    // Fetch paginated orders
    const orders = await Order.find({})
      .populate("user", "id username") // Populate user details
      .sort({ createdAt: -1 }) // Sort by creation date, descending order
      .skip(skip) // Skip the number of items
      .limit(limit); // Limit the number of items

    // Count total number of orders
    const totalOrders = await Order.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalOrders / limit);

    // Send paginated orders and pagination info in the response
    res.json({
      orders,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ error: error.message });
  }
};


const getUserOrders= async(req,res)=>{
  try {
    const orders= await Order.find({user:req.user._id})
    .sort({ createdAt: -1 }); // Sort by creation date, descending order

    res.json(orders)
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}

const countTotalOrders= async(req,res)=>{
  try {
    const totalOrders= await Order.countDocuments()
    res.json({totalOrders})
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const calculateTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const findOrderById = async (req, res) => {
  const userId = req.params.id; // Retrieve userId from request parameters

  try {
    const orders = await Order.find({ user: userId }).populate('user', 'name email')
    .sort({ createdAt: -1 }); 

    if (orders.length > 0) {
      res.json(orders);
    } else {
      res.status(404).json({ message: "No orders found for this user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const markOrderAsPaid = async (req, res) => {
  console.log('Received orderId:', req.params.id);
  console.log('Request body:', req.body);
  try {
    const order = await Order.findOne({ "_id": req.params.id });
    if (order) {
      console.log('Order found:', order);
      // Use the correct case for status
      if (req.body.paymentResult.status === 'COMPLETED') {
        order.isPaid = true;
        order.paidAt = Date.now();
      } else {
        order.isPaid = false; // Use boolean false
      }

      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
      };

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
      console.log('Updated order:', updatedOrder);
    } else {
      console.error('Order not found');
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error('Error in markOrderAsPaid:', error);
    res.status(500).json({ error: error.message });
  }
};

export { createOrder,getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,  };
