import React from 'react';
import './Home.css'
import { useNavigate } from 'react-router-dom';
// Function to format date
function formatDate(inputDate) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
    // Parse the input date string into a Date object
    const date = new Date(inputDate);
    
    // Extract month and day
    const monthIndex = date.getMonth(); // Returns 0-11 for January-December
    const day = date.getDate();
    
    // Format the month in 'MMM' format and append the day
    const formattedDate = `${months[monthIndex]}-${day}`;
    
    return formattedDate;
}

const PackageCart = ({ packages }) => {
    // Format the date
    const formattedDate = formatDate(packages?.date);
    const navigate =useNavigate()

    return (
        <>
            <div className="rounded-md shadow-2xl shadow-black hover:scale-105 duration-200 flex flex-col cursor-pointer jump-in"
              onClick={()=>navigate(`/package/${packages?._id}`)}>
                <div key={packages?._id} className="package-item">
                    <img
                        src={packages?.images[0]}
                        alt=""
                        className="rounded w-full h-60"
                    />
                                        <h3 className="text-center mt-2 capitalize font-bold ">{packages?.name}</h3>

                    <div className='flex justify-between py-3'>
                    <p className="text-gray-400 mt-2 px-5">{formattedDate}</p>
                    <button className='bg-cyan-500 px-2 rounded-md text-white font-thin cursor-pointer hover:text-cyan-500 hover:bg-white '>${packages?.price}</button>

                    <p className="text-gray-400 mt-2 px-5">{packages?.days} Days</p>

                    </div>
                    
                </div>
            </div>
        </>
    );
};

export default PackageCart;
