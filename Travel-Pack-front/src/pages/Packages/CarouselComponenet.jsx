import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const CarouselComponent = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/package/allPackages");
        // Ensure response.data.packages is an array
        if (Array.isArray(response.data.packages)) {
          setPackages(response.data.packages);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default to 3 slides
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 640, // small screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // medium screens
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024, // large screens
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1280, // extra large screens
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1366, // extra large screens
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleClick = (pkgId) => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Navigate to package details
    navigate(`/package/${pkgId}`);
  };

  return (
    <div className="carousel mx-4 md:relative bottom-48">
      <h2 className="text-2xl font-bold mb-4 ms-5">Explore Other Packages</h2>
      <Slider {...settings}>
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <div key={pkg._id} className="p-2">
              <div
                className="border rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleClick(pkg._id)}
              >
                <img src={pkg.images[0]} alt={pkg.name} className="w-full h-80 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{pkg.name}</h3>
                  <p className="text-gray-600">{pkg.description.substring(0, 100)}...</p>
                  <p className="text-blue-500 font-bold">${pkg.price}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No packages available</p>
        )}
      </Slider>
    </div>
  );
};

export default CarouselComponent;
