import { Box, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { MenuItem } from "@mui/material";

import Button from "@mui/material/Button";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import toast from "react-hot-toast";

const EditModel = ({ isOpen, onClose, data, fetchData, setIsModalOpen }) => {
  if (!isOpen) return null;
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Output: '2025-08-26'
  };

  const { modelData, companyData, locationData, districtData } = useSelector(
    (state) => state.modelDataSlice
  );
  console.log(districtData, "districtData");
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      seats: data?.seats || "",
      district: data?.district || "",
      insurance_end_date: data?.insurance_end_date || "",
      Registeration_end_date: data?.Registeration_end_date || "",
      year_made: data?.year_made || "",
      fuel_type: data?.fuel_type || "",
      transmition: data?.transmition || "",
      insurance_end_date: data?.insurance_end_date || "",
      registeration_end_date: data?.registeration_end_date || "",
      polution_end_date: data?.polution_end_date || "",
      car_type: data?.car_type || "",
      location: data?.location || "",
      addedBy: data?.addedBy || "",
      registeration_number: data?.registeration_number || "",
      company: data?.company || "",
      name: data?.name || "",
      model: data?.model || "",
      base_package: data?.base_package || "",
      price: data?.price || "",
    },
  });

  const onEdit = async (formData) => {
    const token = Cookies.get("refreshToken");

    const updatedData = {
      ...formData,
      id: data.id, // or however you identify the item
      insurance_end_date: formatDate(formData.insurance_end_date),
      registeration_end_date: formatDate(formData.registeration_end_date),
      polution_end_date: formatDate(formData.polution_end_date),
    };
    console.log(updatedData, "updatedData");
    try {
      let res = await axios.put(
        `http://localhost:3000/api/vendor/vendorEditVehicles/${updatedData?.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res, "✅ SUCCESS");
      if (res.status === 200) {
        toast.success("Edit Sucessfully");
        fetchData();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (data) {
      reset({
        seats: data.seats || "",
        district: data.district || "",
        insurance_end_date: data.insurance_end_date || "",
        Registeration_end_date: data.Registeration_end_date || "",
        year_made: data.year_made || "",
        fuel_type: data.fuel_type || "",
        transmition: data.transmition || "",
        insurance_end_date: data.insurance_end_date || "",
        registeration_end_date: data.registeration_end_date || "",
        polution_end_date: data.polution_end_date || "",
        car_type: data.car_type || "",
        location: data.location || "",
        addedBy: data.addedBy || "",
        registeration_number: data.registeration_number || "",
        company: data.company || "",
        name: data.name || "",
        model: data.model || "",
        base_package: data.base_package || "",
        price: data.price || "",
      });
    }
  }, [data, reset]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-gray-50 p-6 rounded-lg w-[80%] max-h-[90vh] overflow-y-auto relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>
        {/* Modal Content */}
        <div>
          <form onSubmit={handleSubmit(onEdit)} className=" text-gray-800">
            <div className="mx-auto   px-6 py-10">
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

                  <TextField
                    required
                    id="name"
                    label="Name"
                    {...register("name")}
                  />

                  <TextField
                    required
                    id="model"
                    label="Model"
                    {...register("model")}
                  />
                  <TextField
                    id="base_package"
                    label="Base Package"
                    {...register("base_package")}
                  />
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
                    name="fuel_type"
                    rules={{ required: "Fuel type is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Fuel Type"
                        required
                        error={!!errors.fuel_type}
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
                  <TextField
                    required
                    id="carType"
                    label="Car Type"
                    {...register("car_type")}
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
                    name="transmition"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        select
                        label="Transmission Type"
                        error={!!errors.transmition}
                      >
                        <MenuItem value="automatic">Automatic</MenuItem>
                        <MenuItem value="manual">Manual</MenuItem>
                      </TextField>
                    )}
                  />

                  <Controller
                    control={control}
                    name="district"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        select
                        label="Vehicle District"
                        error={!!errors.district}
                      >
                        {districtData.map((cur, idx) => {
                          console.log(cur, "cu");
                          return (
                            <MenuItem value={cur} key={idx}>
                              {cur}
                            </MenuItem>
                          );
                        })}
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
                  ].map(({ name, label }) => (
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
                  ))}
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
                    { id: "image", label: "Vehicle Image" },
                  ].map(({ id, label }) => (
                    <div key={id}>
                      <label
                        htmlFor={id}
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        {label}
                      </label>

                      {/* ✅ Show preview if editing and image exists */}
                      {data?.[id] && (
                        <div className="mb-2">
                          {/* Single image */}
                          {!Array.isArray(data[id]) ? (
                            <img
                              src={data[id]}
                              alt={`${label} Preview`}
                              className="w-full h-32 object-cover rounded border"
                            />
                          ) : (
                            // Multiple images
                            <div className="flex flex-wrap gap-2">
                              {data[id].map((url, i) => (
                                <img
                                  key={i}
                                  src={url}
                                  alt={`${label} ${i}`}
                                  className="w-24 h-24 object-cover rounded border"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <input
                        id={id}
                        type="file"
                        multiple
                        className="block w-full p-2 text-sm text-black bg-white border border-gray-300 rounded-lg cursor-pointer"
                        {...register(id)}
                      />
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="mt-10">
                  <Button variant="contained" type="submit" color="primary">
                    Edit
                  </Button>
                </div>
              </Box>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModel;
