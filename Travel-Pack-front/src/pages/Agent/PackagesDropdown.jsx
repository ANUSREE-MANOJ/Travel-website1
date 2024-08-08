import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PackagesDropdown = ({ onSelectPackage }) => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/package/allPackages');
        // Ensure response.data.packages is an array
        if (Array.isArray(response.data.packages)) {
          setPackages(response.data.packages);
          setError(null); // Clear any previous errors
        } else {
          console.error('Unexpected data format:', response.data);
          setError('Failed to load packages');
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        setError('Failed to load packages');
      }
    };

    fetchPackages();
  }, []);

  const handlePackageSelect = (e) => {
    const packageId = e.target.value;
    setSelectedPackage(packageId);
    onSelectPackage(packageId); // Pass selected package ID to parent component
  };

  return (
    <div className='mt-10'>
      <label>Select a Package:</label>
      <select value={selectedPackage} onChange={handlePackageSelect}>
        <option value="">Select Package</option>
        {error ? (
          <option disabled>{error}</option>
        ) : (
          packages.map(pkg => (
            <option key={pkg._id} value={pkg._id}>{pkg.name}</option>
          ))
        )}
      </select>
    </div>
  );
};

export default PackagesDropdown;
