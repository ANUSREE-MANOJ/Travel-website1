import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import Footer from '../../components/Footer';
import './AllPackages.css'; // Import the CSS file
import Loader from '../../components/Loader';

const AllPackages = () => {
  const [packages, setPackages] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const itemsPerPage = 3; // Number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5002/api/package/allPackages', {
          params: {
            page: currentPage,
            limit: itemsPerPage
          }
        });
        console.log('Response data:', response.data); // Log the response
        if (Array.isArray(response.data.packages)) {
          setPackages(response.data.packages);
          setTotalPages(response.data.totalPages); // Update total pages
        } else {
          console.error('Unexpected response format:', response.data);
          toast.error('Invalid data format');
          setPackages([]); // Reset to an empty array
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        toast.error('Failed to fetch packages');
        setPackages([]); // Reset to an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [currentPage]);

  if (loading) {
    return <Loader />;
  }

  function formatDate(inputDate) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(inputDate);
    const monthIndex = date.getMonth();
    const day = date.getDate();
    return `${months[monthIndex]}-${day}`;
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="all-packages">
      <div className="packages-list mt-10">
        {packages.length === 0 ? (
          <p>No packages available.</p> // Display message if no packages
        ) : (
          packages.map(pkg => (
            <div key={pkg._id} className="package-card">
              <div className="image-container">
                <img src={pkg.images[0]} alt={pkg.name} className="package-image" />
              </div>
              <div className="package-details">
                <h2 className="package-name">{pkg.name}</h2>
                <p className="package-description">{pkg.description}</p>
                <p className="package-rating">Rating: {pkg.rating}</p>
              </div>
              <div className="package-info">
                <div className="info-top">
                  <p className="package-days">{pkg.days} days</p>
                  <p className="package-date">{formatDate(pkg.date)}</p>
                </div>
                <p className="package-price">from <span className="price">${pkg.price}</span></p>
                <button
                  className="details-button"
                  onClick={() => navigate(`/package/${pkg?._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls flex justify-center items-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 w-8 h-8 rounded-full ${currentPage === index + 1 ? 'bg-teal-600' : 'bg-gray-400'} text-white flex items-center justify-center`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <ToastContainer />
      <Footer />
    </div>
  );
};

export default AllPackages;
