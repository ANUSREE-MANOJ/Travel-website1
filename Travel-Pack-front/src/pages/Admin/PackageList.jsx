import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import '../Agent/AllPackages.css'; // Import the CSS file
import Loader from '../../components/Loader';

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to control the loader

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/package/allPackages', { withCredentials: true });
        setPackages(response.data);
        setLoading(false); // Ensure loading is turned off in case of error

      } catch (error) {
        console.error('Error fetching packages:', error);
        toast.error('Failed to fetch packages');
        setLoading(false); // Ensure loading is turned off in case of error

      }
    };

    fetchPackages();
  }, []);

  const deletePackage = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/package/${id}`, { withCredentials: true });
      setPackages(packages.filter(pkg => pkg._id !== id));
      toast.success('Package deleted successfully');
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  };

  if (loading) {
    return <Loader/>; // Show loader while loading
  }
  function formatDate(inputDate) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const date = new Date(inputDate);
    const monthIndex = date.getMonth();
    const day = date.getDate();
    
    return `${months[monthIndex]}-${day}`
  }

 
  

  return (
    <div className="all-packages">
      {/* <h1 className="title mt-10">Packages List</h1> */}
      <div className="packages-list">
        {packages.map(pkg => (
          <div key={pkg._id} className="package-card-container">
            <div className="package-card">
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
            <button
              className="delete-button"
              onClick={() => deletePackage(pkg._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PackageList;
