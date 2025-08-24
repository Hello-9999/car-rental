import Button from "@mui/material/Button";
import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { setVendorEditSuccess } from "../../../redux/vendor/vendorDashboardSlice";
import EditModel from "../../../components/EditModel";

export default function VendorEditProductComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
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
  const { vendorVehilces } = useSelector((state) => state.vendorDashboardSlice);
  const { modelData, companyData, locationData, districtData } = useSelector(
    (state) => state.modelDataSlice
  );

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vehicle_id = queryParams.get("vehicle_id");

  let updateingItem = "";
  vendorVehilces.forEach((cur) => {
    if (cur._id === vehicle_id) {
      updateingItem = cur;
    }
  });

  const insuranceDefaultDate = updateingItem.insurance_end
    ? dayjs(new Date(updateingItem.insurance_end))
    : null;
  const registerationDefaultDate = updateingItem.registeration_end
    ? dayjs(new Date(updateingItem.registeration_end))
    : null;
  const pollutionDefaultDate = updateingItem.pollution_end
    ? dayjs(new Date(updateingItem.pollution_end))
    : null;

  const onEditSubmit = async (editData) => {
    let tostID;
    try {
      if (editData && vehicle_id) {
        tostID = toast.loading("saving...", { position: "bottom-center" });
        const formData = editData;
        const res = await fetch(
          `/api/vendor/vendorEditVehicles/${vehicle_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ formData }),
          }
        );

        if (!res.ok) {
          toast.error("error");
          toast.dismiss(tostID);
        }

        if (res.ok) {
          toast.dismiss(tostID);
          dispatch(setVendorEditSuccess(true));
        }
      }
      reset();
    } catch (error) {
      console.log(error);
    }
    navigate("/vendorDashboard/vendorAddProduct");
  };

  const handleClose = () => {
    setIsModalOpen(true);
    // navigate("/vendorDashboard/vendorAddProduct");
  };

  return (
    <div>
      <EditModel isOpen={isModalOpen} />
      <button onClick={handleClose} className="relative left-10 top-5">
        <div className="padding-5 padding-2 rounded-full bg-slate-100 drop-shadow-md hover:shadow-lg hover:bg-blue-200 hover:translate-y-1 hover:translate-x-1 ">
          <IoMdClose style={{ fontSize: "30" }} />
        </div>
      </button>
      <form onSubmit={onEditSubmit} className="bg-gray-50 text-gray-800">
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
              <TextField id="title" label="Title" {...register("title")} />
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
                    {["petrol", "diesel", "electric", "hybrid"].map((type) => (
                      <MenuItem value={type} key={type}>
                        {type.toUpperCase()}
                      </MenuItem>
                    ))}
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
                {...register("carType")}
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

              <TextField
                required
                id="vehicleLocation"
                label="Car Type"
                {...register("vehicleLocation")}
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
              <Button variant="contained" type="submit" color="primary">
                Submit
              </Button>
            </div>
          </Box>
        </div>
      </form>
    </div>
  );
}
