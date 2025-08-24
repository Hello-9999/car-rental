import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { GoPlus } from "react-icons/go";

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setFilteredData } from "../redux/user/sortfilterSlice";
import { useState } from "react";

const Filter = () => {
  const { control, handleSubmit } = useForm();
  const { userAllVehicles, allVariants } = useSelector(
    (state) => state.userListVehicles
  );
  const { variantMode } = useSelector((state) => state.sortfilterSlice);

  const [filterOpen, setFilterOpen] = useState(false);

  const dispatch = useDispatch();
  let transformedData = [];
  const carTypes = [
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
  ]; // add more types if needed

  const handleData = async (data) => {
    const typeMapping = {
      // suv: "car_type",
      // sedan: "car_type",
      // hatchback: "car_type",

      Hatchback: "car_type",
      Sedan: "car_type",
      SUV: "car_type",
      Crossover: "car_type",
      Coupe: "car_type",
      Convertible: "car_type",
      "Luxury Car": "car_type",
      "Sports Car": "car_type",
      "Electric Car": "car_type",
      "Hybrid Car ": "car_type",
      automatic: "transmition",
      manual: "transmition",
    };

    // Transform the form data object into an array of objects with the desired structure
    transformedData = Object.entries(data)
      // eslint-disable-next-line no-unused-vars
      .filter(([key, value]) => value == true)
      .map(([key, value]) => ({ [key]: value, type: typeMapping[key] }));

    if (transformedData && transformedData.length <= 0 && !variantMode) {
      dispatch(setFilteredData(userAllVehicles));
    } else if (transformedData && transformedData.length > 0) {
      try {
        const res = await fetch("api/user/filterVehicles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transformedData),
        });

        if (res.ok) {
          const data = await res.json();
          const filtData = data.data.filteredVehicles;

          //from filtData filtering vehicles that are available allVariants currently
          //this is done when we have allVariants which means we are searching for available vehicles in Homepage and is redirected
          if (allVariants) {
            const filteredData = filtData.filter((data) =>
              allVariants.some((variant) => variant._id === data._id)
            );
            dispatch(setFilteredData(filteredData));
            return;
          }

          //this is in the other case when we are filtering from AllVehicles
          //when we use filter from  Vehicles in Navbar
          dispatch(setFilteredData(filtData));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClick = () => {
    if (window.innerWidth <= 924) {
      // Only execute on mobile and tablet views
      setFilterOpen(!filterOpen);
    }
  };

  return (
    <div className="bg-white sticky top-5 p-4 max-w-[350px] mx-auto shadow-xl rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 transition"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <GoPlus
            className={`transition-transform duration-300 ${
              filterOpen ? "rotate-45" : "rotate-0"
            }`}
          />
        </button>
      </div>

      {/* Filters Form */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          filterOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <form onSubmit={handleSubmit(handleData)} className="space-y-6">
          {/* Car Type */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Type</h3>
            <FormGroup className="flex flex-col gap-2">
              {carTypes.map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Controller
                      name={type.toLowerCase()}
                      control={control}
                      render={({ field }) => (
                        <Checkbox {...field} checked={field.value ?? false} />
                      )}
                    />
                  }
                  label={type}
                />
              ))}
            </FormGroup>
          </div>

          {/* Transmission */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Transmission
            </h3>
            <FormGroup className="flex flex-col gap-2">
              {["Automatic", "Manual"].map((trans) => (
                <FormControlLabel
                  key={trans}
                  control={
                    <Controller
                      name={trans.toLowerCase()}
                      control={control}
                      render={({ field }) => (
                        <Checkbox {...field} checked={field.value ?? false} />
                      )}
                    />
                  }
                  label={trans}
                />
              ))}
            </FormGroup>
          </div>

          {/* Apply Button */}
          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Apply Filters
          </button>
        </form>
      </div>
    </div>
  );
};

export default Filter;
