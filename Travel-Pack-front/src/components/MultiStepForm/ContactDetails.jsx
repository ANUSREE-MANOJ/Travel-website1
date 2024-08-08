import React, { useState } from 'react';
import Review from './Review';

const ContactDetails = ({ nextStep, id }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });



  const validateForm = () => {
    const errors = {};

    if (!formData.firstName) {
      errors.firstName = 'First Name is required';
    }
    if (!formData.lastName) {
      errors.lastName = 'Last Name is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone Number is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: '',
    });
  };

  const handleSubmit = () => {
    if (validateForm()) {

        nextStep();
    }
  };

  
  return (
    <div className="lg:flex lg:space-x-4 lg:mx-20">
      <div className="lg:w-1/2">
        <h2 className="text-2xl font-semibold mb-4 mt-10">Contact Details</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="px-4 py-2 border rounded-md w-full"
                value={formData.firstName}
                onChange={handleChange}
              />
              {formErrors.firstName && (
                <p className="text-red-500 text-sm">{formErrors.firstName}</p>
              )}
            </div>
            <div className="w-full lg:w-1/2">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="px-4 py-2 border rounded-md w-full"
                value={formData.lastName}
                onChange={handleChange}
              />
              {formErrors.lastName && (
                <p className="text-red-500 text-sm">{formErrors.lastName}</p>
              )}
            </div>
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="px-4 py-2 border rounded-md w-full"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm">{formErrors.email}</p>
            )}
          </div>
          <div>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              className="px-4 py-2 border rounded-md w-full"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {formErrors.phoneNumber && (
              <p className="text-red-500 text-sm">{formErrors.phoneNumber}</p>
            )}
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md w-full lg:w-auto"
            onClick={handleSubmit}
          >
            Next
          </button>
        </form>
      </div>
      <div className="lg:w-1/2 lg:relative lg:mt-10">
        <Review id={id} />
      </div>
    </div>
  );
};

export default ContactDetails;
