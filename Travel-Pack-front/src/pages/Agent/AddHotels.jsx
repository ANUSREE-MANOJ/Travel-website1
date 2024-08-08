import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PackagesDropdown from './PackagesDropdown';

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Hotel Name is required'),
  address: Yup.string().required('Address is required'),
  rating: Yup.number().min(1).max(5).required('Rating is required'),
  pricePerNight: Yup.number().positive('Price must be a positive number').required('Price per night is required'),
  facilities: Yup.string().required('Facilities are required'),
  images: Yup.mixed().required('At least one image is required')
});

const AddHotels = () => {
  const [selectedPackage, setSelectedPackage] = useState('');

  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const facilitiesArray = values.facilities.split(',').map(facility => facility.trim());

    const data = new FormData();
    data.append('name', values.name);
    data.append('address', values.address);
    data.append('rating', values.rating);
    data.append('pricePerNight', values.pricePerNight);
    facilitiesArray.forEach((facility) => {
      data.append('facilities[]', facility);
    });
    Array.from(values.images).forEach((file) => {
      data.append('images', file);
    });

    try {
      const response = await axios.post(`http://localhost:5002/api/hotels`, data, {
        withCredentials: true,
        params: { placeId: selectedPackage },
      });
      console.log('Hotel created successfully:', response.data);
      toast.success('Hotel created successfully');
      resetForm(); // Reset the form fields after successful submission
      setSelectedPackage(''); // Reset the selected package if needed
    } catch (error) {
      console.error('Error creating hotel:', error);
      toast.error('Failed to create hotel');
    }

    setSubmitting(false);
  };

  return (
    <div className="container mx-auto max-w-md p-4 mt-20">
      <h2 className="text-2xl font-bold mb-4">Add Hotel</h2>
      <PackagesDropdown onSelectPackage={handlePackageSelect} />
      {selectedPackage && (
        <Formik
          initialValues={{
            name: '',
            address: '',
            rating: '',
            pricePerNight: '',
            facilities: '',
            images: []
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div className="flex flex-col">
                  <label className="mb-1 font-semibold">Hotel Name:</label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Hotel Name"
                    className="border rounded-lg p-2 bg-teal-500 text-white"
                  />
                  <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-semibold">Address:</label>
                  <Field
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="border rounded-lg p-2 bg-teal-500 text-white"
                  />
                  <ErrorMessage name="address" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-semibold">Rating:</label>
                  <Field
                    type="number"
                    name="rating"
                    placeholder="Rating"
                    className="border rounded-lg p-2 bg-teal-500 text-white"
                  />
                  <ErrorMessage name="rating" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-semibold">Price per Night:</label>
                  <Field
                    type="number"
                    name="pricePerNight"
                    placeholder="Price per Night"
                    className="border rounded-lg p-2 bg-teal-500 text-white"
                  />
                  <ErrorMessage name="pricePerNight" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-semibold">Facilities:</label>
                  <Field
                    as="textarea"
                    name="facilities"
                    placeholder="Facilities"
                    className="border rounded-lg p-2 bg-teal-500 text-white"
                  />
                  <ErrorMessage name="facilities" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-semibold">Images:</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFieldValue('images', e.target.files)}
                    className="border rounded-lg p-2 bg-teal-500 text-white"
                    accept="image/*"
                  />
                  <ErrorMessage name="images" component="p" className="text-red-500 text-sm" />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Create Hotel
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default AddHotels;
