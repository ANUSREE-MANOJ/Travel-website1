// src/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <div className="relative text-white py-16 w-full mt-20 " style={{ backgroundImage: `url('../footer3.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Semi-transparent overlay */}
      <div className="relative container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">GIVE US A CALL</h4>
            <p>Office Landline: +44 5567 32 664 567</p>
            <p>Mobile: +44 5567 89 3322 332</p>
          </div>
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">COME & DROP BY</h4>
            <p>4124 Barnes Street, Sanford, FL 32771</p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">SEND US A MESSAGE</h4>
            <p>youremail@gmail.com</p>
            <p>Office@yourbusinessname.com</p>
          </div>
        </div>
        <form className="relative z-10 flex flex-col md:flex-row justify-center md:justify-start gap-4">
          <input type="text" placeholder="Name" className="px-4 py-2 rounded-md text-gray-800" />
          <input type="email" placeholder="Your e-mail" className="px-4 py-2 rounded-md text-gray-800" />
          <button type="submit" className="px-4 py-2 bg-orange-500 rounded-md text-white">SUBSCRIBE</button>
        </form>
      </div>
    </div>
  );
};

export default Footer;
