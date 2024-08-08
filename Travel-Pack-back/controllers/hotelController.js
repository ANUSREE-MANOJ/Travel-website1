import multer from 'multer';
import cloudinary from '../utils/cloudinary.js'; // Ensure cloudinary configuration is set up properly
import Hotel from '../models/HotelModel.js'; // Adjust path as per your project structure
import asyncHandler from '../middlewares/asyncHandler.js';

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle image upload
const uploadImages = upload.array('images'); // 'images' should match the field name in your form

// @desc    Create a new hotel
// @route   POST /api/hotels/create
// @access  Private/Admin (adjust access level as per your application's requirements)
const createHotel = asyncHandler(async (req, res) => {
  // Destructure hotel details from request body
  const { name, address,  rating, pricePerNight, facilities } = req.body;
  const placeId = req.query.placeId; // Extract placeId from query parameters

  try {
    // Map over uploaded files and upload them to Cloudinary
    const uploadPromises = req.files?.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url); // Resolve with the secure URL of the uploaded image
          }
        ).end(file.buffer); // Send the file buffer to Cloudinary
      });
    });

    // Wait for all image upload promises to complete
    const imagePaths = await Promise.all(uploadPromises);

    // Create a new hotel instance with the uploaded image URLs
    const newHotel = new Hotel({
      name,
      address,
      placeId,
      rating,
      pricePerNight,
      facilities,
      images: imagePaths, // Assign uploaded image URLs to the 'images' field
    });

    // Save the new hotel to the database
    await newHotel.save();

    // Respond with the created hotel object
    res.status(201).json(newHotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create hotel', error: error.message });
  }
});

// @desc    Fetch hotels by place ID
// @route   GET /api/hotels/place/:placeId
// @access  Public (adjust access level as per your application's requirements)
const getHotelsByPlace = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({ placeId: req.params.placeId })
  .sort({ createdAt: -1 }); // Sort by creation date, descending order

  res.json(hotels);
});

// @desc    Fetch single hotel by ID
// @route   GET /api/hotels/:id
// @access  Public (adjust access level as per your application's requirements)
const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    res.json(hotel);
  } else {
    res.status(404).json({ message: 'Hotel not found' });
  }
});

// @desc    Update hotel by ID
// @route   PUT /api/hotels/:id
// @access  Private/Admin (adjust access level as per your application's requirements)
const updateHotel = asyncHandler(async (req, res) => {
  const { name, address, placeId, rating, pricePerNight, facilities, images } = req.body;

  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    hotel.name = name || hotel.name;
    hotel.address = address || hotel.address;
    hotel.placeId = placeId || hotel.placeId;
    hotel.rating = rating || hotel.rating;
    hotel.pricePerNight = pricePerNight || hotel.pricePerNight;
    hotel.facilities = facilities || hotel.facilities;
    hotel.images = images || hotel.images;

    const updatedHotel = await hotel.save();
    res.json(updatedHotel);
  } else {
    res.status(404).json({ message: 'Hotel not found' });
  }
});


const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id);

  if (hotel) {
    res.json({ message: 'Hotel removed' });
  } else {
    res.status(404).json({ message: 'Hotel not found' });
  }
});

const getAllHotels = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 4; // Number of items per page
  const skip = (page - 1) * limit; // Calculate how many items to skip
  
  const hotels = await Hotel.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalHotels = await Hotel.countDocuments(); // Total number of hotels
  
  if (hotels.length > 0) {
    res.status(200).json({
      hotels,
      totalPages: Math.ceil(totalHotels / limit), // Calculate total pages
      currentPage: page
    });
  } else {
    res.status(404).json({ message: 'No hotels found' });
  }
});



export { createHotel, getHotelsByPlace, getHotelById, updateHotel, deleteHotel, uploadImages ,getAllHotels};
