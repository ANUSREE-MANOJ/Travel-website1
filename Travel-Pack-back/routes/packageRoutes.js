// routes/packageRoutes.js
import express from 'express';
import formidable from 'express-formidable';
import { authenticate,  autherizeAdmin,  autherizeAgent } from '../middlewares/authMiddleware.js';
import { createPackage, fetchAllPackages, fetchPackageById, fetchTopProducts, uploadImages ,addPackageReview ,searchPackage ,removePackage ,updatePackageDetails} from '../controllers/packageController.js';
import checkId from "../middlewares/checkId.js"
const router = express.Router();

// POST route to handle package creation with images
router.get('/search', searchPackage);

router.route('/upload').post(authenticate,autherizeAgent,uploadImages, createPackage )
router.route("/allpackages").get(fetchAllPackages ,uploadImages);
router.get("/top", fetchTopProducts);
router.put('/:id',authenticate,autherizeAgent,updatePackageDetails);
            
router.route("/:id").get(fetchPackageById)
router.route("/:id").delete(authenticate,autherizeAgent,removePackage)

router.route("/:id/reviews").post(authenticate,checkId,  addPackageReview);




export default router;
