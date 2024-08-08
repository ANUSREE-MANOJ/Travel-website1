import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';

const OrderList = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // State for initial loading and page changes
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const itemsPerPage = 2; // Number of items per page

  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true); // Set loading to true when starting to fetch data
      try {
        // Ensure user is authorized
        if (userInfo && userInfo.isAdmin) {
          const response = await axios.get(`http://localhost:5002/api/orders?page=${currentPage}&limit=${itemsPerPage}`, {
            withCredentials: true,
          });
          setOrders(response.data.orders);
          setCurrentPage(response.data.currentPage);
          setTotalPages(response.data.totalPages);
        } else {
          setError('You are not authorized to view this page');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchAllOrders();
  }, [currentPage, userInfo]); // Fetch data when currentPage or userInfo changes

  // Pagination calculations
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page); // Change the page and trigger fetch
    }
  };

  if (loading) return <Loader />; // Show loader while data is being fetched
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="order-details p-4 ">
      <h2 className="text-2xl font-semibold mb-4 text-center mt-14">
        Orders <span className='text-gray-400 text-xs'>{orders.length} orders found</span>
      </h2>
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="bg-white min-w-full mt-5">
            <thead>
              <tr className="w-full uppercase text-sm text-gray-600 leading-normal">
                <th className="py-3 px-6 text-left">#</th> {/* Order Number */}
                <th className="py-3 px-6 text-left">OrderID</th>
                <th className="py-3 px-6 text-left">User</th>
                <th className="py-3 px-6 text-left">Payment Method</th>
                <th className="py-3 px-6 text-left">Total Price</th>
                <th className="py-3 px-6 text-left">Payment Status</th>
                <th className="py-3 px-6 text-left">Booked Package</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {orders.map((order, index) => (
                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{index + 1 + (currentPage - 1) * itemsPerPage}</td> {/* Order Number */}
                  <td className="py-3 px-6 text-left">{order._id}</td>
                  <td className="py-3 px-6 text-left">
                    {order.user ? `${order.user.username}` : 'Unknown'}
                  </td>
                  <td className="py-3 px-6 text-left">{order.paymentMethod}</td>
                  <td className="py-3 px-6 text-left">${order.totalPrice}</td>
                  <td className="py-3 px-6 text-left">
                    {order.isPaid ? (
                      <span className="text-white bg-green-500 px-4 py-1 rounded-full">Paid</span>
                    ) : (
                      <span className="text-red-500 font-semibold rounded-full text-xs md:text-sm lg:text-base px-2 py-1 lg:flex-1 justify-center items-center">Not Paid</span>
                    )}
                    {order.isPaid && <div className='mt-3'><span className='font-semibold'>Paid At:</span> <span className='text-xs'>{new Date(order.paidAt).toLocaleString()}</span></div>}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <ul className="list-inside">
                      {order.bookedItems.map((item, index) => (
                        <li key={index} className="mb-4">
                          <div><img src={item?.packageImages[0]} alt="" className='h-28 w-40' /></div>
                          <div><span className='font-semibold'>Destination:</span> {item.packageName}</div>
                          <div><span>Hotel:</span> {item.hotelName}</div>
                          <div><span>Address:</span> {item.hotelAddress}</div>
                          <div><span>Rating:</span> {item?.hotelRating}***</div>
                        </li>
                      ))}
                    </ul>
                  </td>
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
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
};

export default OrderList;
