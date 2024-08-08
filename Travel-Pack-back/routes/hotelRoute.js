// routes/hotelRoutes.js

import express from 'express';
const router = express.Router();
import {
  getHotelsByPlace,
  createHotel,
  getHotelById,
  updateHotel,
  deleteHotel,
  uploadImages,
  getAllHotels
} from '../controllers/hotelController.js';
import { authenticate, autherizeAdmin, autherizeAgent } from '../middlewares/authMiddleware.js';

// Fetch all hotels for a place
router.route('/place/:placeId').get(getHotelsByPlace);

// Create a new hotel, fetch a single hotel, update a hotel, and delete a hotel
router.route('/').post(authenticate,autherizeAgent,uploadImages,createHotel);
router
  .route('/:id')
  
  .get(getHotelById)
  .put(authenticate,autherizeAgent, updateHotel)
  .delete(authenticate,autherizeAgent, deleteHotel);

router.route('/').get(getAllHotels)
export default router;
