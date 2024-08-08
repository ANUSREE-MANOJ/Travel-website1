import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/userSlice";
import Loader from "../../components/Loader";
import axios from "axios";

const Dashboard = () => {
  const { data: customers } = useGetUsersQuery();
  const [sales, setSales] = useState(null);
  const [orders, setOrders] = useState(null);
  const [salesDetail, setSalesDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/orders/total-sales", {
          withCredentials: true,
        });
        setSales(response.data);
      } catch (error) {
        console.error("Error fetching total sales:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/orders/total-orders", {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };

    const fetchSalesByDate = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/orders/total-sales-by-date", {
          withCredentials: true,
        });
        setSalesDetail(response.data);
      } catch (error) {
        console.error("Error fetching sales by date:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
    fetchOrders();
    fetchSalesByDate();
  }, []);

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [{ name: "Sales", data: formattedSalesDate.map((item) => item.y) }],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="p-4 mt-20 min-h-screen">
      <section className="space-y-4">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="bg-black p-4 rounded-lg w-full sm:w-[20rem]">
            <div className="font-bold rounded-full w-8 h-8 bg-pink-500 text-center text-white p-2 mx-auto">$
            </div>
            <p className="mt-2 text-white text-center">Sales</p>
            <h1 className="text-xl font-bold text-white text-center">
              {isLoading ? <Loader /> : `$ ${sales?.totalSales.toFixed(2)}`}
            </h1>
          </div>
          <div className="bg-black p-4 rounded-lg w-full sm:w-[20rem]">
            <div className="font-bold rounded-full w-8 h-8 bg-pink-500 text-center text-white p-2 mx-auto">$
            </div>
            <p className="mt-2 text-white text-center">Customers</p>
            <h1 className="text-xl font-bold text-white text-center">
              {isLoading ? <Loader /> : customers?.length}
            </h1>
          </div>
          <div className="bg-black p-4 rounded-lg w-full sm:w-[20rem]">
            <div className="font-bold rounded-full w-8 h-8 bg-pink-500 text-center text-white p-2 mx-auto">$
            </div>
            <p className="mt-2 text-white text-center">All Orders</p>
            <h1 className="text-xl font-bold text-white text-center">
              {isLoading ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>
        <div className="mt-40"> {/* Increased margin-top */}
          <Chart
            options={state.options}
            series={state.series}
            type="line"
            width="100%"
            height="300"
            className="text-black mt-20"
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
