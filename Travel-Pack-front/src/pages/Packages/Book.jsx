import React from 'react'
import { useLocation } from 'react-router';

const Book = () => {
  const location = useLocation();
  const { selectedRoom, totalPrice } = location.state || {};

  return (
    <div className='mt-5'>
    <h1 className=' font-bold text-xl ms-10'>Review Your Booking</h1>
      
    </div>
  )
}

export default Book