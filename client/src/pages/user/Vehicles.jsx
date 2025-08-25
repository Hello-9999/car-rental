import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setVariants,
  setVehicleDetail,
  showVehicles,
} from "../../redux/user/listAllVehicleSlice";
import { FaCarSide } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Filter from "../../components/Filter";
import Sort from "../../components/Sort";
import { signOut } from "../../redux/user/userSlice";
import Footers from "../../components/Footer";
import SkeletonLoader from "../../components/ui/SkeletonLoader";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_PRODUCTION_BACKEND_URL;

const refreshToken = Cookies.get("refreshToken");
let accessToken = localStorage.getItem("accessToken");
//use Custome hook in this case :)
export const onVehicleDetail = async (id, dispatch, navigate) => {
  try {
    const res = await fetch(`${BASE_URL}/api/user/showVehicleDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    });
    const data = await res.json();

    if (data.statusCode == 401 || data.statusCode == 403) {
      dispatch(signOut());
    }

    dispatch(setVehicleDetail(data));
    navigate("/vehicleDetails");
  } catch (error) {
    console.log(error);
  }
};

const Vehicles = () => {
  const { userAllVehicles } = useSelector((state) => state.userListVehicles);
  const { data, filterdData } = useSelector((state) => state.sortfilterSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  //allVariants are set to null when we enter AllVehicles from navbar

  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/user/listAllVehicles`, {
        headers: { Authorization: `Bearer ${refreshToken},${accessToken}` },
        credentials: "include",
      });
      if (!res.ok) {
        console.log("not success");
      }
      if (res.ok) {
        const data = await res.json();
        dispatch(showVehicles(data));
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    dispatch(setVariants(null));
  }, [dispatch, data]);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className=" lg:grid lg:grid-cols-12 gap-x-10  p-12  justify-between bg-[#d3d8d8]">
        <div className=" mt-10 col-span-3   lg:relative box-shadow-xl lg:drop-shadow-xl">
          <Filter />
        </div>
        <div className="col-span-9">
          <div className="mt-10  bg-blend-overlay  backdrop-blur-xl opacity-1 box-shadow-xl  top-5 z-40 drop-shadow-lg ">
            <Sort />
          </div>

          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
              {filterdData && filterdData.length > 0 ? (
                filterdData
                  .filter((car) => car.isAdminApproved)
                  .map((cur, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                    >
                      {/* Image */}
                      <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden">
                        {/* <img
                          onClick={() => alert("Clicked!")}
                          src={cur?.image}
                          alt={cur?.car_title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        /> */}

                        <img
                          onClick={() =>
                            onVehicleDetail(cur.id, dispatch, navigate)
                          }
                          src={cur?.image}
                          alt={cur?.car_title}
                          className="
    w-full h-64 sm:h-72 md:h-80 lg:h-full 
 
    rounded-lg 
    shadow-md 
    transition-transform duration-300 
    hover:scale-105  object-cover
    cursor-pointer
  "
                        />
                      </div>

                      {/* Car Info */}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h2 className="text-sm font-semibold text-gray-900 capitalize">
                            {cur.car_title}
                          </h2>
                          <div className="text-sm text-gray-800 text-right">
                            <p className="font-semibold">RS {cur.price}</p>
                            <span className="text-xs text-gray-500">
                              Per Day
                            </span>
                          </div>
                        </div>

                        {/* Optional Car Details */}
                        <div className="flex justify-between text-xs text-gray-600">
                          <p className="flex items-center gap-1">
                            <FaCarSide className="text-gray-500" />{" "}
                            {cur.company}
                          </p>
                          <p className="flex items-center gap-1">
                            <MdAirlineSeatReclineNormal className="text-gray-500" />{" "}
                            {cur.seats}
                          </p>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <p className="flex items-center gap-1">
                            <FaCarSide className="text-gray-500" />{" "}
                            {cur.car_type}
                          </p>
                          <p className="flex items-center gap-1">
                            <BsFillFuelPumpFill className="text-gray-500" />{" "}
                            {cur.fuel_type}
                          </p>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Action Buttons */}
                        <div className="flex justify-between mt-3 gap-2">
                          <Link
                            to="/vehicleDetails"
                            onClick={() =>
                              onVehicleDetail(cur.id, dispatch, navigate)
                            }
                          >
                            <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors duration-300 p-6">
                              Book Ride
                            </button>
                          </Link>
                          <Link
                            to="/vehicleDetails"
                            onClick={() =>
                              onVehicleDetail(cur.id, dispatch, navigate)
                            }
                          >
                            <button className="flex-1 bg-black hover:bg-gray-800 text-white py-2 rounded-lg transition-colors duration-300 p-6">
                              Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="max-w-[400px] mx-auto mt-10 flex flex-col items-center gap-4">
                  <img
                    src="https://d310a92p0we78s.cloudfront.net/illustration/premium/additional-file/2829991/1.svg"
                    alt="No cars"
                    className="w-60"
                  />
                  <p className="text-lg font-semibold text-gray-700">
                    No cars found
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footers />
    </>
  );
};

export default Vehicles;
