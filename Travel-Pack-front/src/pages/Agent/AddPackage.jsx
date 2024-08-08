import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  description: Yup.string().required('Description is required'),
  price: Yup.number()
    .positive('Price must be a positive number')
    .required('Price is required'),
  days: Yup.number()
    .positive('Days must be a positive integer')
    .integer('Days must be an integer')
    .required('Days is required'),
  date: Yup.date().required('Date is required'),
  schedule: Yup.array()
    .of(
      Yup.object().shape({
        day: Yup.number().required(),
        description: Yup.string().required('Schedule description is required'),
      })
    )
    .min(1, 'At least one schedule day is required'),
});

const AddPackage = () => {
  return (
    <div className="container mx-auto max-w-md p-4 mt-10">
      <h1 className="font-bold text-2xl text-orange-800 mt-5">Add Package</h1>
      <Formik
        initialValues={{
          name: '',
          description: '',
          price: '',
          days: '',
          date: '',
          images: [],
          schedule: [{ day: 1, description: '' }],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const packageData = new FormData();
            values.images.forEach((image) => packageData.append('images', image));
            packageData.append('name', values.name);
            packageData.append('description', values.description);
            packageData.append('price', values.price);
            packageData.append('date', values.date);
            packageData.append('days', values.days);
            packageData.append('schedule', JSON.stringify(values.schedule));

            const response = await axios.post('http://localhost:5002/api/package/upload', packageData, { withCredentials: true });
            if (response.status === 201) {
              toast.success(`${response?.data.name} created`);
              console.log(response.data);
              resetForm(); // Reset form fields after successful submission
            }
          } catch (error) {
            console.error(error);
            toast.error('Package creation failed. Try again.');
          }
          setSubmitting(false);
        }}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-10">
              <div className="mb-4">
                <label className="block mb-1">Name:</label>
                <Field
                  type="text"
                  name="name"
                  className="border rounded-lg p-2 w-full bg-teal-600 text-white"
                />
                <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description:</label>
                <Field
                  as="textarea"
                  name="description"
                  className="border rounded-lg p-2 w-full bg-teal-600 text-white"
                />
                <ErrorMessage name="description" component="p" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Price:</label>
                <Field
                  type="number"
                  name="price"
                  className="border rounded-lg p-2 w-full bg-teal-600 text-white"
                />
                <ErrorMessage name="price" component="p" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Days:</label>
                <Field
                  type="number"
                  name="days"
                  className="border rounded-lg p-2 w-full bg-teal-600 text-white"
                />
                <ErrorMessage name="days" component="p" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Date:</label>
                <Field
                  type="date"
                  name="date"
                  className="border rounded-lg p-2 w-full bg-teal-600 text-white"
                />
                <ErrorMessage name="date" component="p" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Images:</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFieldValue('images', Array.from(e.target.files))}
                  className="border rounded-lg p-2 w-full bg-teal-600 text-white"
                  accept="image/*"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Schedule:</label>
              <FieldArray name="schedule">
                {({ remove, push }) => (
                  <>
                    {values.schedule.map((_, index) => (
                      <div key={index} className="mb-2 flex items-center">
                        <Field
                          type="text"
                          name={`schedule.${index}.description`}
                          placeholder={`Day ${index + 1} description`}
                          className="border rounded-lg p-2 w-full mr-2 bg-teal-600 text-white"
                        />
                        <ErrorMessage name={`schedule.${index}.description`} component="p" className="text-red-500 text-sm mt-1" />
                        {values.schedule.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="bg-red-500 text-white px-2 py-1 rounded-lg"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ day: values.schedule.length + 1, description: '' })}
                      className="bg-green-500 text-white px-2 py-1 rounded-lg mt-2"
                    >
                      Add Day
                    </button>
                  </>
                )}
              </FieldArray>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  );
};

export default AddPackage;
