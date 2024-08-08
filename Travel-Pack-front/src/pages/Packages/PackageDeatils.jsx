import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import './packageDetails.css';
import Loader from "../../components/Loader";
import CarouselComponent from "./CarouselComponenet";
import { toast } from "react-toastify";

const PackageDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [packageData, setPackageData] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true); // State to control the loader

  const fetchPackageDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/api/package/${id}`);
      setPackageData(response.data);
    } catch (error) {
      console.error("Error fetching package details:", error);
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rating = parseInt(reviewData.rating, 10);

    if (isNaN(rating) || rating < 1 || rating > 5) {
      setError("Please select a valid rating between 1 and 5.");
      return;
    }
    if (!reviewData.comment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5002/api/package/${id}/reviews`,
        reviewData,
        { withCredentials: true }
      );

      toast.success(response.data.message);
      setMessage(response.data.message);

      // Refresh package details to include the new review
      fetchPackageDetails();
      setReviewData({ rating: 0, comment: "" });
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  if (loading) {
    return <Loader />; // Show loader while data is being fetched
  }

  return (
    <div className="container mx-auto p-4 mt-10">
      <h1 className="text-4xl font-bold mb-10 text-center mt-5">
        {packageData.name}
      </h1>

      <div className={`grid lg:grid-cols-3 md:grid-cols-2 gap-4 border-none ${packageData.images.length < 5 ? 'grid-cols-1' : ''}`}>
        {/* Images */}
        {packageData.images.map((image, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className={`h-48 w-full cursor-pointer hover:scale-105 duration-200 ${index % 2 !== 0 ? 'mt-2' : ''}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 mx-4 md:mx-10">
        <h1 className="font-bold text-2xl">Tour Overview</h1>
        <p className="mb-4 mt-7">{packageData.description}</p>
        <h1 className="font-semibold text-xl">Itinerary</h1>
        <ul className="ml-5 mt-5 border-l-4 border-cyan-500 pl-4">
          {packageData.schedule.map((item, index) => (
            <li key={index} className="mb-4 relative">
              <span className="absolute -left-6 top-0 w-4 h-4 bg-cyan-500 rounded-full"></span>
              <span className="font-bold">Day {item.day}:</span>{" "}
              {item.description}
            </li>
          ))}
        </ul>
      </div>

      <div className="spot relative lg:absolute lg:left-[900px] lg:bottom-56 w-full lg:w-72 p-4 lg:top-[750px] md:static">
        <h1 className="text-lg font-semibold">Reserve Your spot</h1>
        <div className="border px-4 py-2 rounded-lg mt-2">
          <h1 className="font-semibold mt-3">Full Day {packageData?.name} Highlights</h1>
          <p className="text-gray-400">Pickup Included</p>
          <p className="mt-2 font-bold">Total ${packageData?.price}</p>
          <p className="text-gray-400">Price Included tax and booking fees</p>
        </div>
        <button
          className="border px-4 py-3 rounded-lg bg-cyan-600 text-white hover:text-cyan-500 hover:bg-white mt-5 w-full md:w-72"
          onClick={() => navigate(`/place/${id}/hotels`)}
        >
          Check Accommodation Facilities
        </button>
      </div>

      <div className="review my-8 mx-4 md:mx-10 lg:ms-20 relative md:bottom-[200px] lg:mt-[250px]">
        <h2 className="text-2xl font-bold mb-4 ms-7 lg:ml-5">Customer Reviews</h2>
        {packageData.reviews.length === 0 ? (
          <p className="lg:ml-7">No reviews yet. Be the first to review this package!</p>
        ) : (
          packageData.reviews.map((review, index) => (
            <div key={index} className="mb-8 p-4 flex flex-col  space-x-4">
              <div className="w-16 h-16 bg-cyan-900 rounded-full flex items-center justify-center text-white font-bold ">
                {review?.name[0]}
              </div>

              <div className="flex flex-col md:flex-row justify-between w-full md:w-[800px]">
                <div className="md:w-1/2">
                  <h3 className="text-lg font-semibold mt-2">{review?.name}</h3>
                  <p className="text-gray-600 mb-2">{new Date(review?.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="md:w-1/2 md:pl-4">
                  <p className="mt-7">Rating: {review?.rating}.0 *</p>
                  <p className="mt-1 font-semibold">{review?.comment}</p>
                </div>
              </div>

             
            </div>
          ))
        )}
      </div>

      <div className="comment my-8 mx-4 md:mx-24 relative md:bottom-[200px]">
        <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Rating</label>
            <select
              value={reviewData.rating}
              onChange={(e) =>
                setReviewData({ ...reviewData, rating: e.target.value })
              }
              required
              className="w-full md:w-[600px] border rounded p-2"
            >
              <option value="">Select...</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Comment</label>
            <input type="text"
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData({ ...reviewData, comment: e.target.value })
              }
              required
              className="border w-full md:w-[600px] rounded p-2"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Submit Review
          </button>
        </form>
      </div>

      <CarouselComponent />
      <div className="footer lg:relative bottom-36 ">
        <Footer />
      </div>
    </div>
  );
};

export default PackageDetails;
