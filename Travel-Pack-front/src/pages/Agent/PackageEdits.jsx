// frontend/src/components/PackageEdits.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import Loader from '../../components/Loader';
import './AllPackages.css';

const PackageEdits = () => {
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    rating: '',
    days: '',
    date: '',
    price: '',
    images: [],
    schedule: '',
    numReviews: 0,
    reviews: []
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 4;
  const navigate = useNavigate();

  const fetchPackages = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5002/api/package/allPackages?page=${page}&limit=${itemsPerPage}`, { withCredentials: true });
      setPackages(response.data.packages);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(currentPage);
  }, [currentPage]);

  const deletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {

    try {
      await axios.delete(`http://localhost:5002/api/package/${id}`, { withCredentials: true });
      setPackages(packages.filter(pkg => pkg._id !== id));
      toast.success('Package deleted successfully');
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  }
  };

  const editPackage = (pkg) => {
    setEditingPackage(pkg);
    setEditFormData({
      name: pkg.name,
      description: pkg.description,
      rating: pkg.rating,
      days: pkg.days,
      date: pkg.date,
      price: pkg.price,
      images: pkg.images,
      schedule: pkg.schedule.map(item => `${item.day}:${item.description}`).join(', '),
      numReviews: pkg.numReviews,
      reviews: pkg.reviews
    });
    setShowModal(true);
  };

  const handleView = (id) => {
    navigate(`/package/${id}`);
  };

  const updatePackage = async (e) => {
    e.preventDefault();

    try {
       
        const scheduleArray = editFormData.schedule.split(',').map(item => item.trim()).filter(item => item !== '');

        if (scheduleArray.length === 0) {
            throw new Error('Schedule cannot be empty');
        }

    
        const parsedSchedule = scheduleArray.map(item => {
            const [day, description] = item.split(/:(.+)/).map(part => part.trim());

            if (!day || !description || isNaN(day)) {
                throw new Error('Invalid schedule format. Ensure it is in the format: day:description');
            }
            return { day: parseInt(day, 10), description };
        });

        const updatedPackage = {
            name: editFormData.name,
            description: editFormData.description,
            rating: editFormData.rating,
            days: editFormData.days,
            date: new Date(editFormData.date).toISOString().split('T')[0],
            price: editFormData.price,
            images: editFormData.images,
            schedule: parsedSchedule,
            numReviews: editFormData.numReviews,
            reviews: editFormData.reviews
        };

        await axios.put(`http://localhost:5002/api/package/${editingPackage._id}`, updatedPackage, { withCredentials: true });

        setPackages(packages.map(pkg => pkg._id === editingPackage._id ? { ...pkg, ...updatedPackage } : pkg));
        toast.success('Package updated successfully');
        setShowModal(false);
        setEditingPackage(null);
    } catch (error) {
        console.error('Error updating package:', error);
        toast.error(`Failed to update package: ${error.message}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPackages(page);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 mt-10">
      <h1 className='text-center text-xl text-red-900 font-semibold'>
        Packages <span className='text-sm text-gray-600'>({packages.length} found)</span>
      </h1>
      <table className="min-w-full bg-white rounded-lg shadow-md mt-10">
        <thead className="text-gray-600">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">PACKAGES</th>
            <th className="px-4 py-2 text-left">IMAGE</th>
            <th className="px-4 py-2 text-left">RATING</th>
            <th className="px-4 py-2 text-left">DATE</th>
            <th className="px-4 py-2 text-left">DAYS</th>
            <th className="px-4 py-2 text-left">PRICE</th>
            <th className="px-4 py-2 text-left">EDIT</th>
            <th className="px-4 py-2 text-left">DELETE</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {packages.map((pkg, index) => (
            <tr key={pkg._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 text-left">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td className="px-4 py-2 text-left">{pkg.name}</td>
              <td className="px-4 py-2">
                <img src={pkg.images[0]} alt={pkg.name} className="h-24 w-28 object-cover" />
              </td>
              <td className="px-4 py-2 text-left">{Number(pkg.rating).toFixed(2)}</td>
              <td className="px-4 py-2 text-left">{new Date(pkg.date).toLocaleDateString()}</td>
              <td className="px-4 py-2 text-left">{pkg.days}</td>
              <td className="px-4 py-2 text-left">${pkg.price}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => editPackage(pkg)}
                  className="bg-teal-600 text-white px-2 py-1 text-sm rounded hover:bg-teal-700"
                >
                  EDIT
                </button>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => deletePackage(pkg._id)}
                  className="bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700"
                >
                  DELETE
                </button>
              </td>
              <td className='px-1 py-1'>
                <button className='bg-cyan-600 text-white px-5 py-1 rounded-lg hover:bg-cyan-950 mr-2 '
                onClick={() => handleView(pkg._id)}>VIEW</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4 overflow-auto max-h-[80vh]">
            <h2 className="text-teal-600 text-xl font-semibold mb-4">Edit Package</h2>
            <form onSubmit={updatePackage} className="space-y-4">
              <div>
                <label className="block mb-2">Name:</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="border p-2 w-full bg-teal-500 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Description:</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="border p-2 w-full bg-teal-500 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Rating:</label>
                <input
                  type="text"
                  value={editFormData.rating}
                  onChange={(e) => setEditFormData({ ...editFormData, rating: e.target.value })}
                  className="border p-2 w-full bg-teal-500 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Days:</label>
                <input
                  type="number"
                  value={editFormData.days}
                  onChange={(e) => setEditFormData({ ...editFormData, days: e.target.value })}
                  className="border p-2 w-full bg-teal-500 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Date:</label>
                <input
                  type="date"
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                  className="border p-2 w-full bg-teal-500 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Price:</label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  className="border p-2 w-full bg-teal-500 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Images (comma-separated URLs):</label>
                <input
                  type="text"
                  value={editFormData.images.join(', ')}
                  onChange={(e) => setEditFormData({ ...editFormData, images: e.target.value.split(',').map(url => url.trim()) })}
                  className="border p-2 w-full bg-teal-500 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Schedule (day:description, day:description):</label>
                <input
                  type="text"
                  value={editFormData.schedule}
                  onChange={(e) => setEditFormData({ ...editFormData, schedule: e.target.value })}
                  className="border p-2 w-full bg-teal-500 text-white"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default PackageEdits;
