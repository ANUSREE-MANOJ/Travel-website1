import express from 'express';
const router = express.Router();
import { createOrder,getAllOrders,
    getUserOrders,
    countTotalOrders,
    calculateTotalSales,
    calculateTotalSalesByDate,
    findOrderById,
    markOrderAsPaid,} from '../controllers/orderController.js';
    import { authenticate, autherizeAdmin } from "../middlewares/authMiddleware.js";


    router
  
  router.route("/").post(authenticate, createOrder)

  router.route("/").get(authenticate, autherizeAdmin, getAllOrders);
  router.route("/mine").get(authenticate, getUserOrders);
  router.route("/total-orders").get(authenticate,autherizeAdmin,countTotalOrders);
  router.route("/total-sales").get(authenticate,autherizeAdmin,calculateTotalSales);
  router.route("/total-sales-by-date").get(authenticate,autherizeAdmin,calculateTotalSalesByDate);
  router.route("/:id").get(authenticate, findOrderById);
  router.route("/:id/pay").put( markOrderAsPaid);

export default router;
