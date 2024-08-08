import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/userSlice";
import { setCredentials} from "../../redux/features/auth/authSlice";
import { ToastContainer } from 'react-toastify';

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  console.log('Initial userInfo:', userInfo); // Debugging log
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
          userType: userInfo.userType // Include userType in the update request
        }).unwrap();

  
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully',res);
        
       
      } catch (err) {
        console.error('Update error:', err); // Debugging log
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  p-4">
      <div className="p-8 rounded w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center mb-6 text-cyan-800">Edit Profile</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label className="block  text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="shadow text-white appearance-none border rounded w-full py-3 px-4 bg-cyan-700 leading-tight focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block  text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="text-white shadow appearance-none border rounded w-full py-3 px-4 bg-cyan-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              id="password"
              type="password"
              placeholder="Enter a new password"
              className="text-white  shadow appearance-none border rounded w-full py-3 px-4 bg-cyan-700 leading-tight focus:outline-none focus:shadow-outline placeholder-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              className="bg-cyan-700 shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:shadow-outline placeholder-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-teal-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-teal-700 placeholder-white"
            >
              Update
            </button>
          </div>
          {loadingUpdateProfile && <Loader />}
        </form>
      </div>
    </div>
  );
};

export default Profile;
