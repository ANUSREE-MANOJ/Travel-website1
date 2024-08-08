import React, { useState, useEffect, useRef } from 'react';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from 'axios';
import Review from './Review';
import { useLocation, useNavigate, useParams } from 'react-router';
import Modal from '../Modal'; // Import your Modal component
import './Payment.css';

const PaymentDetails = ({ prevStep, id }) => {
  const [bookedItems, setBookedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const totalPriceRef = useRef(null);
  const [hotels, setHotels] = useState([]);
  const location = useLocation();
  const { selectedRoom } = location.state || {};
  const bookedItemsRef = useRef([]);
  const [orderIds, setOrderId] = useState('');
  const orderIdRef = useRef('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/hotels/place/${id}`);
        setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchHotels();
  }, [id]);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/package/${id}`);
        const packageData = response.data;

        if (hotels.length > 0) {
          const bookedItem = {
            package: packageData._id,
            packageName: packageData.name,
            packageImages: packageData.images,
            packageRating: packageData.rating,
            packagePrice: packageData.price,
            hotel: hotels[0]._id,
            hotelName: hotels[0].name,
            hotelAddress: hotels[0].address,
            hotelRating: hotels[0].rating,
            hotelImages: hotels[0].images,
          };

          setBookedItems([bookedItem]);
          bookedItemsRef.current = [bookedItem];

          totalPriceRef.current = packageData.price * selectedRoom;
          setTotalPrice(packageData.price * selectedRoom);
          console.log(packageData.price * selectedRoom);
        }
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };

    if (hotels.length > 0) {
      fetchPackageDetails();
    }
  }, [id, hotels, selectedRoom]);

  console.log(bookedItems);

  const createOrder = async (data, actions) => {
    try {
      const bookedItems = bookedItemsRef.current;
      console.log('Sending bookedItems:', bookedItems); // Log the state

      const response = await axios.post('http://localhost:5002/api/orders/', {
        bookedItems,
        paymentMethod: 'PayPal',
        totalPrice: totalPriceRef.current,
      }, {
        withCredentials: true
      });
      console.log("data:", response.data);
      setOrderId(response.data._id);
      orderIdRef.current = response.data._id;
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: totalPriceRef.current
          }
        }]
      });
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const capture = await actions.order.capture();
      const orderId = orderIdRef.current;
      console.log(orderId);
      console.log('captured', capture);
      console.log("capture", data);

      // Assuming you send the order ID to your backend to capture payment
      const response = await axios.put(`http://localhost:5002/api/orders/${orderId}/pay`, {
        paymentResult: {
          id: capture.id,
          status: capture.status,
          update_time: capture.update_time,
        }
      });

      setIsModalOpen(true); // Open the modal
      console.log('Capture details:', response.data);
    } catch (error) {
      console.error("Error capturing payment:", error);
    }
  };

  return (
    <div className="screen mx-auto p-4 mt-10">
      <div className="mb-4">
        <button
          type="button"
          className="px-4 py-2 bg-cyan-500 text-white rounded-md"
          onClick={prevStep}
        >
          Back
        </button>
      </div>
      <div className="pay flex flex-col lg:flex-row lg:w-full justify-between gap-20 xl:w-full md:relative bottom-52 lg:top-7">
        <div className="review w-full lg:ml-20 lg:mt-0">
          <Review id={id} />
        </div>
        <div className="payment w-full lg:mr-20">
          <h2 className="text-2xl font-semibold mb-4">Pay Now</h2>
          <div className="w-full max-w-md">
            <PayPalScriptProvider options={{ "client-id": "AZwVuuxgbQYgY6aBLt6Vizzh8JXsTgr5D0N157osuIkMpkJFx-pN3zYM-4hpi6wJ_bFw-UHFIc62clWA" }}>
              <PayPalButtons
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Payment successful!"
      />
    </div>
  );
};

export default PaymentDetails;
