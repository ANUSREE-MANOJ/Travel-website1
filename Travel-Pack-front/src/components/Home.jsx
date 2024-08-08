import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import PackageCart from './PackageCart';
import Footer from './Footer';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loader';

const Home = () => {
  const images = ['../sea7.jpg', '../wave2.jpg', '../sky4.jpg', '../sky6.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [topPackages, setTopPackages] = useState([]);
  const [packages, setPackages] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true); // State to control the loader

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const fetchTopPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/package/top');
        setTopPackages(response.data);
      } catch (error) {
        console.error('Error fetching top packages:', error);
      }
    };

    fetchTopPackages();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/package/allPackages');
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
        toast.error('Failed to fetch packages');
      }
      finally{
        setLoading(false); // Stop loading after fetching data

      }
    };

    fetchPackages();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/api/package/search?query=${searchInput}`);
      const destination = response.data;
      if (destination) {
        navigate(`/package/${destination._id}`);
      } else {
        toast.error('Destination not found');
      }
    } catch (error) {
      console.error('Error searching for destination:', error);
      toast.error('Failed to search for destination');
    }
  };

  if(loading)
    {
      return <Loader/>
    }

  return (
    <div className="relative h-screen">
      {/* Banner Section */}
      <div className="absolute inset-0 w-full h-[650px] bg-cover bg-center transition-opacity duration-1000 ease-in-out " style={{ backgroundImage: `url(${images[currentImageIndex]})` }} />
      <div className="absolute inset-0 bg-black opacity-50 h-[650px]" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white md:flex-row">
        <div className='content '>
        <h1 className="head   text-6xl md:text-7xl font-bold font-serif animate-pulse ">Explore The World</h1>
        <p className="para1  mt-4 text-xl text-center">What we offer is an unforgettable journey and experience.</p>
        <div className="search mt-8 flex space-x-4 lg:ml-48 md:ml-48 xl:ml-48">
          <input
            type="text"
            placeholder="Where is your destination"
            className="p-2 rounded bg-white text-black px-4"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <button className="p-2 rounded bg-blue-600 text-white" onClick={handleSearch}>Search</button>
        </div>
        </div>
       
      </div>

      {/* About Us Section */}
      <div className="max-w-[1200px] mx-auto p-4 flex flex-col md:flex-row items-start mt-10">
        <div className="md:w-1/2 p-4">
          <p className="text-cyan-400 border-l-0">ABOUT US</p>
          <h1 className="font-semibold text-5xl mt-3 animate-pulse">Welcome!</h1>
          <p className="mt-10">Traveling broadens horizons, offering new experiences and perspectives. Each journey we take enriches our lives with memories and stories to cherish.</p>
          <p className="mt-6">Manager: <span className="text-cyan-400">Michen Taylor</span></p>
        </div>
        <div className="md:w-1/2 grid grid-cols-2 gap-4 md:mt-0">
          <div className="grid grid-cols-1 gap-4">
            <img src="../Banner.jpg" alt="Hotel View 1" className="w-full h-40 object-cover rounded-lg hover:scale-105 duration-200 cursor-pointer" />
            <img src="../sky6.jpg" alt="Hotel View 2" className="w-full h-40 object-cover rounded-lg hover:scale-105 duration-200 cursor-pointer" />
          </div>
          <img src="../sea8.jpg" alt="Hotel View 3" className="w-full h-full object-cover rounded-lg hover:scale-105 duration-200 cursor-pointer" />
        </div>
      </div>

      {/* Trending Destinations Section */}
      <div className="mt-10">
        <h1 className="text-center text-2xl font-semibold animate-pulse ">Trending Destinations</h1>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 p-1 gap-10 mx-20 mt-10">
          {topPackages.map(packages => (
            <PackageCart key={packages._id} packages={packages} />
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Home;
