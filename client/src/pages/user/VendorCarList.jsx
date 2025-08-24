import { useDispatch, useSelector } from "react-redux";
import { FaCarSide } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { onVehicleDetail } from "./Vehicles";
import CarNotFound from "./CarNotFound";
import Filter from "../../components/Filter";
import Sort from "../../components/Sort";
import Header from "../../components/Header";
import { setVariantModeOrNot } from "../../redux/user/sortfilterSlice";
import { useEffect, useState } from "react";
import { showVehicles } from "../../redux/user/listAllVehicleSlice";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import EditModel from "../../components/EditModel";

const BASE_URL = import.meta.env.VITE_PRODUCTION_BACKEND_URL;

const refreshToken = Cookies.get("refreshToken");
let accessToken = localStorage.getItem("accessToken");

const VendorCarList = () => {
  const { allVariants } = useSelector((state) => state.userListVehicles);

  const { currentUser } = useSelector((state) => state.user);
  const { data, filterdData } = useSelector((state) => state.sortfilterSlice);
  const [vendorCarList, setVendorCarList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

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
        const filteredData = data.filter(
          (item) => item?.addedBy === currentUser?.id
        );
        // Dispatch only the filtered result
        setVendorCarList(filteredData);
        dispatch(showVehicles(filteredData));

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      let res = await axios.delete(
        `http://localhost:3000/api/vendor/vendorDeleteVehicles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      console.log(res, "res");
      if (res?.status == 200) {
        toast.success("Delete Sucessfully ");
        fetchData();
      }
    } catch (error) {
      console.log(error.message, "error.message");
      console.log(error, "❌ MAIN REQUEST FAILED");
      console.log(error.response);
      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);
      } else {
        console.log("❌ NO RESPONSE / NETWORK ERROR", error.message);
      }
    }
  };

  const onEdit = async (data) => {
    setEditData(data);
    setIsModalOpen(true);
    // navigate(`/profile/vendorEdit/${id}`);
  };
  useEffect(() => {
    dispatch(setVariantModeOrNot(true));

    fetchData();
  }, [dispatch]);

  return (
    <>
      <EditModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={editData}
        fetchData={fetchData}
        setIsModalOpen={setIsModalOpen}
      />{" "}
      <div
        className={`w-full   flex justify-between items-center px-6 sm:px-12 md:px-18 lg:py-6 lg:px-28 pt-10   sm:max-w-[900px] lg:max-w-[1500px] mx-auto `}
      >
        <h1 className="font-bold">My Vehicles</h1>
      </div>
      <div className="lg:grid lg:grid-cols-4 gap-6">
        <div className="col-span-4">
          {vendorCarList && vendorCarList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
              {vendorCarList
                .filter((car) => car.isDeleted === 0)
                .map((cur, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="relative w-full">
                      <img
                        src={cur.image}
                        alt={cur.car_title}
                        className="w-full h-64 sm:h-72 md:h-80 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h2 className="text-sm font-semibold text-gray-900 capitalize">
                          {cur.car_title}
                        </h2>
                        <div className="text-sm text-gray-800 text-right">
                          <p className="font-semibold">{cur.price}</p>
                          <span className="text-xs text-gray-500">Per Day</span>
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-gray-600">
                        <p className="flex items-center gap-1">
                          <FaCarSide className="text-gray-500" />
                          {cur.company}
                        </p>
                        <p className="flex items-center gap-1">
                          <MdAirlineSeatReclineNormal className="text-gray-500" />
                          {cur.seats}
                        </p>
                      </div>

                      <div className="flex justify-between text-xs text-gray-600">
                        <p className="flex items-center gap-1">
                          <FaCarSide className="text-gray-500" />
                          {cur.car_type}
                        </p>
                        <p className="flex items-center gap-1">
                          <BsFillFuelPumpFill className="text-gray-500" />
                          {cur.fuel_type}
                        </p>
                      </div>

                      <hr className="border-gray-200" />

                      <div className="flex justify-between mt-3 gap-2">
                        <button
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors duration-300"
                          onClick={() => onEdit(cur)}
                        >
                          Edit
                        </button>
                        <button
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors duration-300"
                          onClick={() => onDelete(cur?.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
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
      </div>
    </>
  );
};

export default VendorCarList;
