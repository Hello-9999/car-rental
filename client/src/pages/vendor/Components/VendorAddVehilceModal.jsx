import { useDispatch, useSelector } from "react-redux";
import {
  addVehicleClicked,
  // setEditData,
} from "../../../redux/adminSlices/actions";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { MenuItem } from "@mui/material";
import { fetchModelData } from "../../admin/components/AddProductModal";
import { useEffect, useState } from "react";

import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { IoMdClose } from "react-icons/io";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Cookies from "js-cookie";

const VendorAddProductModal = () => {
  // const { register, handleSubmit, reset, control } = useForm();
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("refreshToken");

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fuelType: "",
      seats: "",
      transmitionType: "",
      vehicleDistrict: "",
      insurance_end_date: "",
      Registeration_end_date: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const { modelData, companyData, locationData, districtData } = useSelector(
    (state) => state.modelDataSlice
  );
  const { _id, id } = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    fetchModelData(dispatch);
  }, []);

  const onSubmit = async (addData) => {
    setLoading(true);
    // try {
    const fileFields = [
      "images",
      "insurance_image",
      "pollution_image",
      "rc_book_image",
    ];

    const formData = new FormData();

    fileFields.forEach((field) => {
      if (addData[field]) {
        if (addData[field] instanceof FileList) {
          for (let i = 0; i < addData[field].length; i++) {
            formData.append(field, addData[field][i]);
          }
        } else if (addData[field] instanceof File) {
          formData.append(field, addData[field]);
        }
      }
    });

    formData.append("registeration_number", addData?.registeration_number);
    formData.append("company", addData?.company);

    // formData.append("name", addData?.name);
    formData.append("model", addData?.model);
    formData.append("title", addData.title);
    // formData.append("base_package", addData.base_package);
    formData.append("price", addData.price);
    // formData.append("description", addData.description);
    formData.append("year_made", addData.year_made);
    formData.append("fuel_type", addData.fuelType);
    formData.append("seat", addData.seats);
    formData.append("transmition_type", addData.transmitionType);
    formData.append("insurance_end_date", addData.insurance_end_date);
    formData.append("registeration_end_date", addData.Registeration_end_date);
    formData.append("polution_end_date", addData.polution_end_date);
    formData.append("car_type", addData.carType);
    formData.append("location", addData.vehicleLocation);
    formData.append("district", addData.vehicleDistrict);
    formData.append("addedBy", id);

    // let tostID = toast.loading("Saving...", { position: "bottom-center" });

    try {
      let res = await axios.post(
        "http://localhost:3000/api/vendor/vendorAddVehicle",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res, "✅ SUCCESS");
      if (res?.status === 200) {
        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.log(error.message, "error.message");
      console.log(error, "❌ MAIN REQUEST FAILED");
      console.log(error.response);
      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);

        if (error.response.status === 401) {
          console.warn("⚠️ TOKEN EXPIRED – Refreshing...");
          try {
            const refreshRes = await axios.post("/api/auth/refreshToken", {
              withCredentials: true,
            });
            console.log(refreshRes.data, "REFRESH RESPONSE");

            const newAccessToken = refreshRes.data.accessToken;
            localStorage?.setItem("accessToken", newAccessToken);
            console.log("NEW TOKEN:", newAccessToken);

            localStorage.setItem("token", newAccessToken);

            // 🔄 RETRY
            const retryRes = await axios.post(
              "/api/vendor/vendorAddVehicle",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              }
            );

            console.log(retryRes.data, retryRes.status, "✅ RETRY SUCCESS");
            if (refreshRes?.status === 200) {
              toast.success(res?.data?.message);
            }
          } catch (refreshError) {
            console.log("❌ REFRESH FAILED", refreshError);

            toast.error("Session expired, please log in again");
          }
        }
      } else {
        console.log("❌ NO RESPONSE / NETWORK ERROR", error.message);
        toast.error("Something went wrong ");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/vendorDashboard/vendorAllVeihcles");
  };

  return (
    <>
      <Toaster />
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-50 text-gray-800"
        >
          <div className="mx-auto w-full max-w-5xl px-6 py-10">
            <Box
              sx={{
                "& .MuiTextField-root": {
                  marginBottom: "1.5rem",
                  width: "100%",
                },
              }}
            >
              {/* Section 1: Basic Info */}
              <h2 className="text-xl font-semibold mb-4">
                Vehicle Registration Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  required
                  id="registeration_number"
                  label="Registration Number"
                  {...register("registeration_number")}
                />

                <TextField
                  id="company"
                  required
                  label="Company"
                  {...register("company")}
                />

                {/* <TextField
                  required
                  id="name"
                  label="Name"
                  {...register("name")}
                /> */}

                <TextField
                  required
                  id="model"
                  label="Model"
                  {...register("model")}
                />
                <TextField id="title" label="Title" {...register("title")} />
                {/* <TextField
                  id="base_package"
                  label="Base Package"
                  {...register("base_package")}
                /> */}
                <TextField
                  id="price"
                  type="number"
                  label="Price"
                  {...register("price")}
                />
                <TextField
                  required
                  id="year_made"
                  type="number"
                  label="Year Made"
                  {...register("year_made")}
                />
                <Controller
                  control={control}
                  name="fuelType"
                  rules={{ required: "Fuel type is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Fuel Type"
                      required
                      error={!!errors.fuelType}
                    >
                      {["petrol", "diesel", "electric", "hybrid"].map(
                        (type) => (
                          <MenuItem value={type} key={type}>
                            {type.toUpperCase()}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  )}
                />
              </div>

              {/* Section 2: Vehicle Specs */}
              <h2 className="text-xl font-semibold mt-10 mb-4">
                Vehicle Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  control={control}
                  name="carType"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      select
                      label="Car Type"
                      error={!!errors.carType}
                    >
                      {[
                        "Hatchback",
                        "Sedan",
                        "SUV",
                        "Crossover",
                        "Coupe",
                        "Convertible",
                        "Luxury Car",
                        "Sports Car",
                        "Electric Car",
                        "Hybrid Car",
                      ].map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="seats"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      select
                      label="Seats"
                      error={!!errors.seats}
                    >
                      {["5", "7", "8", "more"].map((seat) => (
                        <MenuItem key={seat} value={seat}>
                          {seat.toLocaleUpperCase()}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  control={control}
                  name="transmitionType"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      select
                      label="Transmission Type"
                      error={!!errors.transmitionType}
                    >
                      <MenuItem value="automatic">Automatic</MenuItem>
                      <MenuItem value="manual">Manual</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="vehicleDistrict"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      select
                      label="Vehicle District"
                      error={!!errors.vehicleDistrict}
                    >
                      {districtData.map((cur, idx) => (
                        <MenuItem value={cur} key={idx}>
                          {cur}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </div>

              {/* Section 3: Dates */}
              <h2 className="text-xl font-semibold mt-10 mb-4">
                Document Expiry Dates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "insurance_end_date",
                    label: "Insurance End Date",
                    required: true,
                  },
                  {
                    name: "Registeration_end_date",
                    label: "Registration End Date",
                    required: true,
                  },
                  // { name: "polution_end_date", label: "Pollution End Date" },
                ].map(
                  ({ name, label }) => (
                    console.log(!!errors[name], "!!errors[name]"),
                    (
                      <Controller
                        key={name}
                        name={name}
                        control={control}
                        // rules={{ required: `${label} is required` }}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              {...field}
                              label={label}
                              inputFormat="MM/DD/YYYY"
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  required
                                  error={!!errors[name]}
                                  // helperText={errors[name]?.message}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    )
                  )
                )}
              </div>

              {/* Section 4: File Uploads */}
              <h2 className="text-xl font-semibold mt-10 mb-4">
                Upload Documents
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { id: "insurance_image", label: "Insurance Image" },
                  { id: "rc_book_image", label: "RC Book Image" },
                  { id: "pollution_image", label: "Pollution Image" },
                  { id: "images", label: "Vehicle Image" },
                ].map(({ id, label }) => (
                  <div key={id}>
                    <label
                      htmlFor={id}
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      {label}
                    </label>
                    <input
                      id={id}
                      type="file"
                      required
                      multiple
                      className="block w-full p-2 text-sm text-black bg-white border border-gray-300 rounded-lg cursor-pointer"
                      {...register(id)}
                    />
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-10">
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={loading}
                >
                  Submit
                </Button>
              </div>
            </Box>
          </div>
        </form>
      </div>
    </>
  );
};

export default VendorAddProductModal;
