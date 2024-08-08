// controllers/packageController.js
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import Package from "../models/packageModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImages = upload.array("images");

const createPackage = async (req, res) => {
  try {
    const { name, description, price, date, days, schedule } = req.body;

    const parsedSchedule = JSON.parse(schedule);

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          })
          .end(file.buffer);
      });
    });

    const imagePaths = await Promise.all(uploadPromises);

    const newPackage = new Package({
      name,
      description,
      price,
      date,
      days,
      images: imagePaths,
      schedule: parsedSchedule,
    });

    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create package", error: error.message });
  }
};

const addPackageReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;

    console.log("Received review data:", req.body);

    // Ensure rating and comment are provided
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required." });
    }

    const packages = await Package.findById(req.params.id);

    if (packages) {
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      packages.reviews.push(review);

      packages.numReviews = packages.reviews.length;

      packages.rating =
        packages.reviews.reduce((acc, item) => item.rating + acc, 0) /
        packages.reviews.length;

      await packages.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to add review" });
  }
});

// Other handlers remain the same

const updatePackageDetails = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      days,
      date,
      schedule,
      images,
      rating,
      reviews,
      numReviews,
    } = req.body;

    // Validate required fields
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required" });
      case !description:
        return res.status(400).json({ error: "Description is required" });
      case !price:
        return res.status(400).json({ error: "Price is required" });
      case !days:
        return res.status(400).json({ error: "Days are required" });
      case !date:
        return res.status(400).json({ error: "Date is required" });
      case !schedule:
        return res.status(400).json({ error: "Shedule is required" });

      default:
        break;
    }

    const packageData = await Package.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.json(packageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const removePackage = asyncHandler(async (req, res) => {
  try {
    const packageData = await Package.findByIdAndDelete(req.params.id);
    res.json(packageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchPackages = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Package.countDocuments({ ...keyword });
    const packages = await Package.find({ ...keyword })
      .sort({ rating: -1 })

      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      packages,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchPackageById = asyncHandler(async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id);
    if (packageData) {
      res.json(packageData);
    } else {
      res.status(404).json({ error: "Package not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Package not found" });
  }
});
const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const packages = await Package.find({}).sort({ rating: -1 }).limit(6);
    res.json(packages);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});
const fetchAllPackages = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4; 

    const skip = (page - 1) * limit;

  
    const packages = await Package.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPackages = await Package.countDocuments();

    res.json({
      packages,
      totalPages: Math.ceil(totalPackages / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const searchPackage = asyncHandler(async (req, res) => {
  try {
    const { query } = req.query;
    const destination = await Package.findOne({ name: new RegExp(query, "i") }); // Adjust search criteria as necessary
    if (destination) {
      console.log(destination);
      res.json(destination);
    } else {
      res.status(404).json({ message: "Destination not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export {
  uploadImages,
  createPackage,
  updatePackageDetails,
  removePackage,
  fetchPackages,
  fetchPackageById,
  fetchAllPackages,
  fetchTopProducts,
  addPackageReview,
  searchPackage,
};
