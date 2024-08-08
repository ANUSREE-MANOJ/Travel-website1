import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const Review = ({ id }) => {
  const [packageData, setPackageData] = useState(null);
  const [hotels, setHotels] = useState([]);
  const location = useLocation();
  const { selectedRoom } = location.state || {};

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/package/${id}`);
        setPackageData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };

    fetchPackageDetails();
  }, [id]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/hotels/place/${id}`);
        setHotels(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchHotels();
  }, [id]);

  const calculatePrice = (price) => {
    return price * selectedRoom;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats date in MM/DD/YYYY
  };

  return (
    <div className="border w-full lg:w-[700px] px-7 rounded py-5 h-auto lg:flex lg:flex-row">
      <div className="lg:w-1/2">
        <h1 className="font-semibold text-xl">Review Order Details</h1>
        <img src={packageData?.images[0]} alt="" className="mt-4 h-32 w-56 rounded" />
        <div className="mt-4">
          <p className="font-semibold">{packageData?.name}</p>
          <p>{packageData?.rating}.0*</p>
          <p>{packageData?.days} Days - Start at <span className="text-gray-500">{formatDate(packageData?.date)}</span></p>
          <p>Total: ${packageData?.price}</p>
        </div>
      </div>
      <div className="lg:w-1/2 lg:pl-6 mt-6 lg:mt-0">
        <h1 className="font-semibold underline">Accommodation</h1>
        {hotels.map((hotel, i) => (
          <div key={i} className="mt-2">
            <p>{hotel?.name}</p>
            <p className="text-gray-500">{hotel?.address}</p>
            <p>{hotel?.rating}.0 *</p>
            <p>Rooms: <span className="font-semibold">{selectedRoom}</span></p>
            <img src={hotel?.images[1]} alt="" className="w-56 h-36 rounded mt-2" />
          </div>
        ))}
        <div className="flex justify-between font-semibold mt-4">
          <p className="text-lg">Total :</p>
          <p>${calculatePrice(packageData?.price)}</p>
        </div>
      </div>
    </div>
  );
};

export default Review;
