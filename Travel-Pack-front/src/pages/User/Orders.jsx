import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Orders = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo._id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/orders/${id}`, {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred' );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-800">
      {loading ? (
        <p className="text-white mt-28 flex justify-center items-center">Loading order details..</p>
      ) : error ? (
        <p className="text-red-500 flex justify-center items-center mt-[300px]">Error: {error}</p>
      ) : orders.length > 0 ? (
        <div className="w-full max-w-5xl p-4 mt-28">
          {/* Table for larger screens */}
          <div className="hidden sm:block">
            <table className="w-full border-collapse">
              <thead className="uppercase text-xs sm:text-sm leading-normal bg-blue-800 text-white">
                <tr>
                  <th className="py-3 px-2 text-left">User Email</th>
                  <th className="py-3 px-2 text-left">Booked Package</th>
                  <th className="py-3 px-2 text-left">Payment Method</th>
                  <th className="py-3 px-2 text-left">Total Price</th>
                  <th className="py-3 px-2 text-left">Payment Status</th>
                </tr>
              </thead>
              <tbody className="text-white text-xs sm:text-sm font-light">
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-200">
                    <td className="py-3 px-2 text-left break-words">{order.user.email}</td>
                    <td className="py-3 px-2 text-left">
                      <ul className="list-disc list-inside">
                        {order.bookedItems.map((item, index) => (
                          <li key={index} className="flex flex-col mb-4">
                            <div className="flex flex-wrap items-center mb-2">
                              <img src={item?.packageImages[0]} alt="" className="h-16 w-16 object-cover rounded" />
                              <div className="ml-4 flex-1">
                                <div className="text-sm font-medium">{item.packageName}</div>
                                <div className="text-xs">Hotel: {item.hotelName}</div>
                                <div className="text-xs">Address: {item.hotelAddress}</div>
                                <div className="text-xs">Rating: {item?.hotelRating} ***</div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 px-2 text-left break-words">{order.paymentMethod}</td>
                    <td className="py-3 px-2 text-left">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-2 text-left">
                      {order.isPaid ? (
                        <>
                          <span className="text-green-700 bg-white px-2 rounded font-semibold">Paid</span>
                          <div className="text-xs mt-2">Paid At: {new Date(order.paidAt).toLocaleString()}</div>
                        </>
                      ) : (
                        <span className="text-red-500 font-semibold">Not Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card layout for smaller screens */}
          <div className="block sm:hidden ">
            {orders.map((order) => (
              <div key={order._id} className="mb-4 p-4  border border-gray-200 rounded-lg">
                <div className="text-white font-semibold text-lg mb-2">Order for {order.user.email}</div>
                <div className="text-white mb-2">
                  <strong>Booked Package:</strong>
                  <div>
                    {order.bookedItems.map((item, index) => (
                      <div key={index} className="mb-2 flex items-center">
                        <img src={item?.packageImages[0]} alt="" className="h-12 w-12 object-cover rounded mr-2" />
                        <div>
                          <div className="text-sm font-medium">{item.packageName}</div>
                          <div className="text-xs">Hotel: {item.hotelName}</div>
                          <div className="text-xs">Address: {item.hotelAddress}</div>
                          <div className="text-xs">Rating: {item?.hotelRating} ***</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-white mb-2">
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </div>
                <div className="text-white mb-2">
                  <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
                </div>
                <div className="text-white">
                  <strong>Payment Status:</strong>
                  {order.isPaid ? (
                    <>
                      <span className="text-green-700 font-semibold">Paid</span>
                      <div className="text-xs">Paid At: {new Date(order.paidAt).toLocaleString()}</div>
                    </>
                  ) : (
                    <span className="text-red-500 font-semibold">Not Paid</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-black mt-10 text-xl font-semibold flex justify-between items-center">No orders found</p>
      )}
    </div>
  );
};

export default Orders;
