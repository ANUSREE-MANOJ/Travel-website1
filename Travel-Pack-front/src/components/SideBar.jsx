import React from 'react';

const SideBar = ({ setView, logoutHandler, isAdmin, userType }) => {
  const commonLinks = [
    { name: "EDIT PROFILE", view: "edit" }
  ];

  const adminLinks = [
    { name: "Admin Dashboard", view: "admin_dashboard" },
    { name: "All Hotels", view: "admin_hotels" },
    { name: "All Users", view: "admin_users" },
    { name: "All Orders", view: "admin_orders" }
  ];

  const agentLinks = [
    { name: "Add Packages", view: "agent_addpackage" },
    { name: "Add Hotels", view: "agent_addhotel" },
    { name: "All Hotels", view: "agent_hotels" },
    { name: "All Packages", view: "agent_packages" }
  ];

  return (
    <div className='flex flex-col mt-20 lg:w-60 lg:fixed   lg:h-full lg:overflow-y-auto p-4 lg:p-5 bg-cyan-600 text-white'>
      {commonLinks.map((link) => (
        <div
          key={link.name}
          className='cursor-pointer hover:bg-cyan-400 hover:text-white p-2 mb-2 rounded-md mt-4 uppercase text-sm lg:text-base'
          onClick={() => setView(link.view)}
        >
          {link.name}
        </div>
      ))}
      {userType === 'user' && !isAdmin && (
        <div
          className='cursor-pointer hover:bg-cyan-400 hover:text-white p-2 mb-2 rounded-md mt-4 uppercase text-sm lg:text-base'
          onClick={() => setView('bookings')}
        >
          MY BOOKINGS
        </div>
      )}
      {isAdmin && adminLinks.map((link) => (
        <div
          key={link.name}
          className='cursor-pointer hover:bg-cyan-400 hover:text-white p-2 mb-2 rounded-md mt-4 uppercase text-sm lg:text-base'
          onClick={() => setView(link.view)}
        >
          {link.name}
        </div>
      ))}
      {userType === 'travelAgent' && agentLinks.map((link) => (
        <div
          key={link.name}
          className='cursor-pointer hover:bg-cyan-400 hover:text-white p-2 mb-2 rounded-md mt-4 uppercase text-sm lg:text-base'
          onClick={() => setView(link.view)}
        >
          {link.name}
        </div>
      ))}
      <div 
        className='cursor-pointer hover:bg-cyan-400 hover:text-white p-2 rounded-md mt-5 mb-7 uppercase text-sm lg:text-base'
        onClick={logoutHandler}
      >
        LOGOUT
      </div>
    </div>
  );
};

export default SideBar;
