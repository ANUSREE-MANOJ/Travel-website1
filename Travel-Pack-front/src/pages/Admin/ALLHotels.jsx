import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import axios from 'axios';
import './AllHotels.css';  // Import the CSS file

const ALLHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5002/api/hotels', {
          params: {
            page: currentPage,
            limit: itemsPerPage
          }
        });
        setHotels(response.data.hotels);
        setTotalPages(response.data.totalPages);
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

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center mt-12">Hotels</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">HOTEL</th>
                <th className="px-4 py-2 border-b">ADDRESS</th>
                <th className="px-4 py-2 border-b">RATING</th>
                <th className="px-4 py-2 border-b">PRICE PER NIGHT</th>
                <th className="px-4 py-2 border-b">FACILITIES</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel, index) => (
                <tr key={hotel._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b text-left">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td className="px-4 py-2 border-b">
                    <img src={hotel?.images[0]} alt="" className='h-[70px] w-[100px] object-cover' />
                  </td>
                  <td className="px-4 py-2 border-b text-left">
                    <div className='font-semibold text-red-900'>{hotel.name}</div>
                    <div>{hotel.address}</div>
                  </td>
                  <td className="px-4 py-2 border-b text-left">{hotel.rating}</td>
                  <td className="px-4 py-2 border-b text-left">{hotel.pricePerNight}</td>
                  <td className="px-4 py-2 border-b text-left">{hotel.facilities.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
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
        </div>
      )}
    </div>
  );
};

export default ALLHotels;
