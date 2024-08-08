import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { FaSuitcase, FaHome } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../redux/api/userSlice";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutApiCall] = useLogoutMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      setDropdownOpen(false); // Close the dropdown when logging out
    } catch (error) {
      console.error(error);
    }
  };

  const pages = [
    { name: "Packages", link: "/packages", icon: <FaSuitcase size={20} /> },
  ];

  const userLinks = [
    { name: "Profile", link: "/profile" },
    { name: "Logout", action: logoutHandler },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", link: "/admin/dashboard" },
    { name: "All Hotels", link: "/admin/hotels" },
    { name: "All Users", link: "/admin/userlist" },
    { name: "All Orders", link: "/admin/orders" },
  ];

  const agentLinks = [
    { name: "Add Packages", link: "/agent/addpackage" },
    { name: "Add Hotels", link: "/agent/addhotel" },
    { name: "All Hotels", link: "/agent/hotels" },
    { name: "All Packages", link: "/agent/Package" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close the dropdown when the location changes
    setDropdownOpen(false);
    setMenuOpen(false);
  }, [location]);

  const filteredPages = pages.filter((page) => page.link !== location.pathname);
  const filteredUserLinks = userLinks.filter((link) => link.link !== location.pathname);
  const filteredAdminLinks = adminLinks.filter((link) => link.link !== location.pathname);
  const filteredAgentLinks = agentLinks.filter((link) => link.link !== location.pathname);

  const isProfilePage = location.pathname === "/profile";

  return (
    <nav
      className={`w-full z-50 p-2 fixed top-0 flex justify-between items-center ${
        location.pathname === "/" && !isScrolled
          ? "bg-transparent text-white"
          : "bg-black bg-opacity-50 text-white"
      } transition-all duration-300`}
    >
      <div className="flex items-center">
        <Link to="/" className="text-xl flex items-center">
          <h1 className="logo ml-3 font-bold font-sans underline border border-dotted px-3 text-white">
            Tragons <span className="text-5xl">.</span>
          </h1>
        </Link>
        <button
          className={`text-white focus:outline-none md:hidden absolute right-0 ${
            isProfilePage ? "hidden" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-16 6h16"
              ></path>
            </svg>
          )}
        </button>
        {isProfilePage && (
          <Link
            to="/"
            className="md:hidden flex items-center absolute right-0 text-white ml-2"
          >
            <FaHome size={24} />
          </Link>
        )}
      </div>

      <ul
        className={`absolute top-16 left-0 w-full bg-black bg-opacity-60 text-white md:bg-transparent md:text-white md:static md:flex md:flex-col md:items-center ${
          menuOpen && !isProfilePage ? "block" : "hidden"
        } md:block transition-all duration-300 md:justify-center`}
      >
        {filteredPages.map((page, i) => (
          <li
            key={i}
            className="py-2 md:py-0 lg:relative bottom-10 md:relative hover:bg-white px-4 md:text-center"
          >
            <Link
              to={page.link}
              className="navbar-item flex items-center space-x-1 hover:text-blue-500"
            >
              {page.icon}
              <span className="navbar-item-name">{page.name}</span>
            </Link>
          </li>
        ))}

        {userInfo ? (
          <>
            <div className="md:hidden">
              {userInfo.userType === "travelAgent" &&
                filteredAgentLinks.map((link, index) => (
                  <li
                    key={index}
                    onClick={() => setMenuOpen(false)}
                    className="py-2 md:py-0"
                  >
                    <Link
                      to={link.link}
                      className="block px-4 py-2 hover:bg-gray-100 md:text-white hover:text-blue-500"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}

              {userInfo.isAdmin &&
                filteredAdminLinks.map((link, index) => (
                  <li
                    key={index}
                    onClick={() => setMenuOpen(false)}
                    className="py-2 md:py-0"
                  >
                    <Link
                      to={link.link}
                      className="block px-4 py-2 hover:bg-gray-100 md:text-white hover:text-blue-500"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}

              {filteredUserLinks.map((link, index) => (
                <li
                  key={index}
                  onClick={() => {
                    if (link.action) {
                      link.action();
                    }
                    setMenuOpen(false);
                  }}
                  className="py-2 md:py-0"
                >
                  {link.action ? (
                    <button className="block px-4 py-2 hover:bg-gray-100 md:text-white hover:text-blue-500">
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      to={link.link}
                      className="block px-4 py-2 hover:bg-gray-100 md:text-white hover:text-blue-500"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </div>
          </>
        ) : (
          <>
            {location.pathname !== "/login" && (
              <li
                onClick={() => setMenuOpen(false)}
                className={`py-2 md:py-0 ${
                  location.pathname === "/packages" ? "lg:mt-2" : ""
                }`}
              >
                <Link
                  to="/login"
                  className={`navbar-item block px-4 py-2 hover:text-blue-500 md:text-white hover:font-bold md:absolute right-1 bottom-8 ${
                    location.pathname === "/register" ? "lg:bottom-8" : "lg:bottom-16"
                  } lg:absolute right-28  `}
                >
                  Login
                </Link>
              </li>
            )}
            {location.pathname !== "/register" && (
              <li
                onClick={() => setMenuOpen(false)}
                className={`py-2 md:py-0 ${
                  location.pathname === "/packages" ? "lg:mt-2" : ""
                }`}
              >
                <Link
                  to="/register"
                  className={`navbar-item block px-4 py-2 hover:text-blue-500 md:text-white hover:bg-cyan-200 rounded-md lg:relative left-[700px] lg:bottom-16 md:absolute right-2 bottom-9`}
                >
                 <span className="">Register</span> 
                </Link>
              </li>
            )}
          </>
        )}
      </ul>

      <div className="hidden md:flex items-center  space-x-4">
        {isProfilePage ? (
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-500">
            <FaHome size={24} />
            <span></span>
          </Link>
        ) : (
          userInfo && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-white hover:text-blue-500"
              >
                <AiOutlineUser size={24} />
                <span>{userInfo.username}</span>
              </button>
              {dropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg">
                  {userInfo.userType === "travelAgent" &&
                    filteredAgentLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.link}
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}

                  {userInfo.isAdmin &&
                    filteredAdminLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.link}
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}

                  {filteredUserLinks.map((link, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        if (link.action) {
                          link.action();
                        }
                      }}
                    >
                      {link.action ? (
                        <button className="block px-4 py-2 w-full text-left hover:bg-gray-200">
                          {link.name}
                        </button>
                      ) : (
                        <Link
                          to={link.link}
                          className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        )}
      </div>
    </nav>
  );
};

export default Navigation;
