import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const HotelDetails = () => {
  const { id } = useParams(); // Get the place ID from the URL
  const [hotels, setHotels] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookedDate, setBookedDate] = useState(null);
  const [cancellationDate, setCancellationDate] = useState(null);
  const [loading, setLoading] = useState(true); // State to control the loader
  const [alertMessage, setAlertMessage] = useState(''); // State for the alert message
  const [form, setForm] = useState({
    name: '',
    address: '',
    rating: '',
    pricePerNight: '',
    images: [],
  });
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Key to force reset file input

  const { userInfo } = useSelector((state) => state.auth); // Get user info from Redux store

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/hotels/place/${id}`);
        setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    fetchHotels();
  }, [id]);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/package/${id}`);
        setPackageData(response.data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };

    fetchPackageDetails();
  }, [id]);

  useEffect(() => {
    const today = new Date();
    setBookedDate(today);

    const cancellation = new Date(today);
    cancellation.setDate(cancellation.getDate() + 5);
    setCancellationDate(cancellation.toISOString().split('T')[0]);
  }, []);

  const handleRoomSelection = (event) => {
    setSelectedRoom(parseInt(event.target.value, 10));
    setAlertMessage(''); // Clear alert message on room selection
  };

  const calculatePrice = (pricePerNight) => {
    if (selectedRoom && packageData.days) {
      return selectedRoom * pricePerNight * packageData.days;
    }
    return 0;
  };

  const handleBooking = () => {
    if (!userInfo) {
      navigate('/register');
    } else if (selectedRoom) {
      navigate(`/book/${id}`, { state: { selectedRoom } });
    } else {
      setAlertMessage('Please select a room before proceeding to book.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      images: Array.from(e.target.files).map(file => URL.createObjectURL(file))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5002/api/hotels', form);
      toast.success('Hotel created successfully!');

      // Clear form fields
      setForm({
        name: '',
        address: '',
        rating: '',
        pricePerNight: '',
        images: [],
      });

      // Reset file input by updating its key
      setFileInputKey(Date.now());
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'Failed to create hotel.');
    }
  };

  if (loading) {
    return <Loader />; // Show loader while data is being fetched
  }

  return (
    <div className="container mx-auto p-4 mt-10">
      {hotels.length === 0 ? (
        <p>No hotels found for this place.</p>
      ) : (
        hotels.map((hotel) => (
          <div key={hotel._id} className="mb-4 p-4 rounded mt-7">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="lg:w-2/3 lg:pr-4">
                <h2 className="font-bold text-xl">{hotel?.name} *****</h2>
                <p className="mt-2">{hotel.address}</p>
                <p className="mt-2 bg-green-600 w-7 text-center rounded-md text-white">{hotel?.rating}.0</p>
                <p className="font-semibold">very good</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {hotel?.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt=""
                      className="h-48 w-full object-cover hover:scale-105 transition-transform duration-150 cursor-pointer"
                    />
                  ))}
                </div>
              </div>
              <div className="lg:w-1/3 lg:pl-4 mt-4 lg:mt-0">
                <p className="font-semibold text-xl">Per Night: <span className="text-orange-800">${hotel?.pricePerNight}</span></p>
                <div className="mt-4">
                  <h1 className="font-semibold underline">Price</h1>
                  <p className="mt-5 bg-gray-200 py-2 px-2 rounded w-52">1 Room - 2 Guests</p>
                  <p className="mt-2">Per Night {hotel?.pricePerNight}</p>
                  <p className="bg-gray-300 w-20 rounded text-center mt-2">{packageData.days} Days</p>
                  <select name="" id="" className="mt-5" onChange={handleRoomSelection}>
                    <option value="">Select your rooms</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div className="border rounded w-80 px-10 py-5 mt-4">
                  <p className="font-semibold">{hotel?.name}</p>
                  <div className="flex justify-between">
                    <p className="text-green-500 mt-2">Free Breakfast and Dinner included</p>
                    <p>${calculatePrice(hotel?.pricePerNight)}</p>
                  </div>
                  <p className="text-green-500 mt-2">Free Cancellation till {cancellationDate}</p>
                  {alertMessage && <p className="text-red-500 mt-2">{alertMessage}</p>}
                  {!userInfo?.isAdmin && userInfo?.userType !== 'travelAgent' && (
                    <button
                      className="bg-cyan-700 text-white px-20 py-2 rounded hover:text-cyan-700 hover:bg-white mt-10"
                      onClick={handleBooking}
                    >
                      Book now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

     
    </div>
  );
};

export default HotelDetails;
