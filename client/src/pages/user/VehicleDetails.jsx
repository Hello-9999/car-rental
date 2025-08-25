import { GrSecure } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";

import { FaStar } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { GiGearStickPattern } from "react-icons/gi";
import { FaCarSide } from "react-icons/fa";
import { MdAirlineSeatReclineExtra } from "react-icons/md";
import { BsFillFuelPumpFill } from "react-icons/bs";

import { FaCarAlt } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import styles from "../..";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { Link, useNavigate } from "react-router-dom";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useEffect } from "react";
import { showVehicles } from "../../redux/user/listAllVehicleSlice";
// import { signOut } from "../../redux/user/userSlice";

const VehicleDetails = () => {
  const { singleVehicleDetail } = useSelector(
    (state) => state.userListVehicles
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let refreshToken = localStorage.getItem("refreshToken");
  let accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_PRODUCTION_BACKEND_URL
          }/api/user/listAllVehicles`,
          {
            headers: { Authorization: `Bearer ${refreshToken},${accessToken}` },
          }
        );
        if (!res.ok) {
          console.log("not success");
          return;
        }
        const data = await res.json();
        dispatch(showVehicles(data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleBook = async (vehicleId, navigate) => {
    try {
      // const booked = await fetch('/api/auth/refreshToken',{
      //   method: 'POST',
      //   headers: {
      //     'Authorization':`Bearer ${refreshToken},${accessToken}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     vehicleId,

      //   })
      // })

      // if(!booked.ok){
      //   dispatch(signOut())
      //   navigate('/signup')
      //   return
      // }
      // const data = await booked.json();
      // if(data){
      //   navigate('/checkoutPage')
      // }

      navigate("/checkoutPage");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white">
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Back Button */}
            <div className="absolute top-4 left-4 md:left-8">
              <TooltipComponent content={"Back"} position="BottomCenter">
                <Link to={"/vehicles"}>
                  <IoArrowBackCircleSharp className="text-3xl md:text-4xl text-gray-700 hover:text-gray-900 transition-colors" />
                </Link>
              </TooltipComponent>
            </div>
            {/* Vehicle Images */}
            <div className="lg:col-span-3 flex flex-col lg:flex-row items-start relative">
              <div className="lg:flex-1 lg:mr-6 w-full">
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={singleVehicleDetail?.image}
                    alt={singleVehicleDetail?.model}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Thumbnail Images (optional) */}
              <div className="mt-4 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
                {/* Map thumbnails here if multiple images */}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="lg:col-span-2 bg-slate-200 rounded-lg p-6 flex flex-col justify-between min-h-[500px]">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold capitalize text-gray-900">
                  {singleVehicleDetail?.name}
                </h1>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-800  ">
                  {[
                    {
                      icon: <FaCarAlt />,
                      label: "Model",
                      value: singleVehicleDetail?.model,
                    },
                    {
                      icon: <FaBuilding />,
                      label: "Company",
                      value: singleVehicleDetail?.company,
                    },
                    {
                      icon: <CiCalendarDate />,
                      label: "Year",
                      value: singleVehicleDetail?.year_made,
                    },
                    {
                      icon: <GiGearStickPattern />,
                      label: "Transmission",
                      value: singleVehicleDetail?.transmition,
                    },
                    {
                      icon: <FaCarSide />,
                      label: "Car Type",
                      value: singleVehicleDetail?.car_type,
                    },
                    {
                      icon: <MdAirlineSeatReclineExtra />,
                      label: "Seats",
                      value: singleVehicleDetail?.seats,
                    },
                    {
                      icon: <BsFillFuelPumpFill />,
                      label: "Fuel Type",
                      value: singleVehicleDetail?.fuel_type,
                    },
                    {
                      icon: null,
                      label: "Registration Number",
                      value: singleVehicleDetail?.registeration_number,
                    },
                    {
                      icon: <FaStar />,
                      label: "Rating",
                      value: singleVehicleDetail?.rating ?? 0,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 border border-slate-200 p-2 rounded-md"
                    >
                      {item.icon && (
                        <span className="text-gray-700">{item.icon}</span>
                      )}
                      <span className="font-semibold">{item.label}:</span>{" "}
                      {item.value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Book Button */}
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-end text-3xl font-semibold gap-1">
                  {/* <FaIndianRupeeSign className="text-xl" /> */}
                  Rs.
                  <span className="font-normal">
                    {singleVehicleDetail?.price}
                  </span>
                  <span className="text-base font-normal">
                    <span className="font-bold"> / </span>Day
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleBook(
                      singleVehicleDetail._id,
                      navigate,
                      dispatch,
                      singleVehicleDetail
                    )
                  }
                  className="w-full sm:w-auto px-6 py-3 bg-green-500 text-black font-bold rounded-md hover:bg-green-800 transition flex items-center justify-center gap-2"
                >
                  <GrSecure />
                  Book Ride
                </button>
              </div>
            </div>

            {/* Description */}
            {/* <div className="lg:col-span-3 mt-8 lg:mt-0">
              {/* <div className="border-b border-gray-300 mb-4">
                <h2 className="text-lg font-medium text-gray-900 py-2">
                  Description
                </h2>
              </div> */}
            {/* <h3 className="text-2xl font-bold mb-2">
                {singleVehicleDetail?.title}
              </h3>
              <p className="text-gray-700 text-justify">
                {singleVehicleDetail?.description}
              </p> */}
            {/* </div> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VehicleDetails;
