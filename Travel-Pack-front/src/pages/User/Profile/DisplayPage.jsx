import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../../components/SideBar';
import Profile from '../Profile';
import Orders from '../Orders';
import Dashboard from '../../Admin/Dashboard';
import OrderList from '../../Admin/OrderList';
import UserList from '../../Admin/UserList';
import ALLHotels from '../../Admin/ALLHotels';
import AddHotels from '../../Agent/AddHotels';
import AddPackage from '../../Agent/AddPackage';
import HotelEdits from '../../Agent/HotelEdits';
import PackageEdits from '../../Agent/PackageEdits';

import { useLogoutMutation, useProfileMutation } from '../../../redux/api/userSlice';
import { setCredentials, logout } from '../../../redux/features/auth/authSlice';
import Loader from '../../../components/Loader'; // Import the Loader component

const DisplayPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState('default');
  const [logoutApiCall] = useLogoutMutation();
  const [profileApiCall] = useProfileMutation();
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await profileApiCall().unwrap();
        dispatch(setCredentials(profileData));
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false); // Set loading to false after data fetching
      }
    };

    if (!userInfo) {
      fetchProfile();
    } else {
      setLoading(false); // Set loading to false if userInfo is already available
    }
  }, [profileApiCall, dispatch, userInfo]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'edit':
        return <Profile />;
      case 'bookings':
        return <Orders />;
      case 'admin_dashboard':
        return <Dashboard />;
      case 'admin_hotels':
        return <ALLHotels />;
      case 'admin_users':
        return <UserList />;
      case 'admin_orders':
        return <OrderList />;
      case 'agent_addpackage':
        return <AddPackage />;
      case 'agent_addhotel':
        return <AddHotels />;
      case 'agent_hotels':
        return <HotelEdits />;
      case 'agent_packages':
        return <PackageEdits />;
      default:
        return (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto max-w-[90%] lg:max-w-[450px] rounded bg-white bg-opacity-30 flex flex-col items-center justify-center p-4 lg:p-8 sm:py-0 sm:px-1 ">
            <h1 className='font-light mb-4 text-center text-lg md:text-xl sm:text-sm xs:text-xs '>TRAVEL IS THE ONLY THING YOU BUY THAT MAKES YOU RICHER</h1>
            <h1 className="text-2xl md:text-3xl font-semibold text-red-900 mb-4 text-center">Welcome, {userInfo?.username}</h1>
            <div className="mb-4 text-center text-sm md:text-base">
              <label className="font-semibold">Full Name:</label>
              <span className="ml-2">{userInfo?.username}</span>
            </div>
            <div className="mb-4 text-center text-sm md:text-base">
              <label className="font-semibold">Email:</label>
              <span className="ml-2">{userInfo?.email}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="bg-cyan-600 lg:w-60 w-full text-white flex-none ">
        <SideBar 
          setView={setView} 
          logoutHandler={logoutHandler} 
          isAdmin={userInfo?.isAdmin} 
          userType={userInfo?.userType} 
        />
      </div>
      <div className="flex-1 relative h-full">
        {loading ? (
          <Loader /> // Show loader while fetching data
        ) : (
          <>
            {view === 'default' && (
              <img 
                src="../../travel.jpeg" 
                alt="Travel" 
                className="h-full w-full object-cover"
              />
            )}
            <div className="">
              {renderContent()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DisplayPage;
