import { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import axios from 'axios';
import { useNavigate } from 'react-router';

const HotelEdits = () => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editHotel, setEditHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    rating: '',
    pricePerNight: '',
    facilities: '',
    images: ''
  });
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const itemsPerPage = 5; // Number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5002/api/hotels', {
          params: { page: currentPage, limit: itemsPerPage }
        });
        setHotels(data.hotels);
        setTotalPages(data.totalPages);
        setIsLoading(false);
      } catch (error) {
        setError(error.response && error.response.data.message
          ? error.response.data.message
          : error.message);
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [currentPage]);

  const deleteHotelHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await axios.delete(`http://localhost:5002/api/hotels/${id}`, { withCredentials: true });
        setHotels(hotels.filter((hotel) => hotel._id !== id));
        toast.success('Hotel deleted successfully');
      } catch (error) {
        toast.error(error.response && error.response.data.message
          ? error.response.data.message
          : error.message);
      }
    }
  };

  const editHotelHandler = (hotel) => {
    setEditHotel(hotel);
    setFormData({
      name: hotel.name,
      address: hotel.address,
      rating: hotel.rating,
      pricePerNight: hotel.pricePerNight,
      facilities: hotel.facilities.join(', '),
      images: hotel.images.join(', ')
    });
  };

  const updateHotelHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedHotel = {
        ...formData,
        facilities: formData.facilities.split(',').map(facility => facility.trim()),
        images: formData.images.split(',').map(image => image.trim())
      };
      await axios.put(`http://localhost:5002/api/hotels/${editHotel._id}`, updatedHotel, { withCredentials: true });
      setHotels(hotels.map(hotel => hotel._id === editHotel._id ? { ...hotel, ...updatedHotel } : hotel));
      toast.success('Hotel updated successfully');
      setEditHotel(null);
    } catch (error) {
      toast.error(error.response && error.response.data.message
        ? error.response.data.message
        : error.message);
    }
  };

  const closeModal = () => {
    setEditHotel(null);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const ViewDetails = (id) => {
    navigate(`/place/${id}/hotels`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center mt-14 hidden md:block">
        Hotels <span className='text-sm text-gray-600'>({hotels.length} found)</span>
      </h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full mx-auto mt-14 border-collapse block md:table relative bottom-10">
            <thead className="hidden md:table-header-group text-gray-600">
              <tr className="border-t border-gray-200 md:border-none">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">HOTEL</th>
                <th className="px-4 py-2 text-left">ADDRESS</th>
                <th className="px-4 py-2 text-left">RATING</th>
                <th className="px-4 py-2 text-left">PRICE PER NIGHT</th>
                <th className="px-4 py-2 text-left">FACILITIES</th>
                <th className="px-4 py-2 text-left">EDIT</th>
                <th className="px-4 py-2 text-left">DELETE</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {hotels.map((hotel, index) => (
                <tr key={hotel._id} className="border-t border-gray-200 md:border-none block md:table-row">
                  <td className="px-4 py-2 block md:table-cell text-left">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td className="px-4 py-2 block md:table-cell text-left">
                    <img src={hotel?.images[0]} alt="" className='h-[70px] w-[100px]' />
                  </td>
                  <td className="px-4 py-2 block md:table-cell text-left">
                    <div className='font-semibold text-red-900'>{hotel.name}</div>
                    <div>{hotel.address}</div>
                  </td>
                  <td className="px-4 py-2 block md:table-cell text-left">{hotel.rating}</td>
                  <td className="px-4 py-2 block md:table-cell text-left">{hotel.pricePerNight}</td>
                  <td className="px-4 py-2 block md:table-cell text-left">{hotel.facilities.join(', ')}</td>
                  <td className="px-4 py-2 block md:table-cell md:text-right">
                    <button
                      onClick={() => editHotelHandler(hotel)}
                      className="bg-teal-600 hover:bg-teal-900 py-1 px-2 text-sm rounded text-white"
                    >
                      EDIT
                    </button>
                  </td>
                  <td className="px-4 py-2 block md:table-cell md:text-right">
                    <button
                      onClick={() => deleteHotelHandler(hotel._id)}
                      className="bg-red-700 hover:bg-red-900 py-1 px-2 text-sm rounded text-white"
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 w-6 h-6 rounded-full ${currentPage === index + 1 ? 'bg-teal-600' : 'bg-gray-400'} text-white`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {editHotel && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
                <h2 className="text-xl mb-4 text-center">Edit Hotel</h2>
                <form onSubmit={updateHotelHandler} className="flex flex-wrap justify-center gap-4">
                  <div className="w-full md:w-1/2 px-2">
                    <label className="block mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border p-2 w-full bg-teal-500 text-white"
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <label className="block mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="border p-2 w-full bg-teal-500 text-white"
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <label className="block mb-2">Rating</label>
                    <input
                      type="number"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="border p-2 w-full bg-teal-500 text-white"
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <label className="block mb-2">Price Per Night</label>
                    <input
                      type="number"
                      value={formData.pricePerNight}
                      onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                      className="border p-2 w-full bg-teal-500 text-white"
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <label className="block mb-2">Facilities (comma separated)</label>
                    <input
                      type="text"
                      value={formData.facilities}
                      onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                      className="border p-2 w-full bg-teal-500 text-white"
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <label className="block mb-2">Images (comma separated URLs)</label>
                    <input
                      type="text"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      className="border p-2 w-full bg-teal-500 text-white"
                    />
                  </div>
                  <div className="w-full flex justify-center mt-4">
                    <button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-900 py-2 px-4 rounded text-white"
                    >
                      Update Hotel
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-500 hover:bg-gray-700 py-2 px-4 ml-4 rounded text-white"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelEdits;
