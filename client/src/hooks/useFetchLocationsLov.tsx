import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setCompanyData,
  setDistrictData,
  setLocationData,
  setModelData,
} from "../redux/adminSlices/adminDashboardSlice/CarModelDataSlice";
import { setWholeData } from "../redux/user/selectRideSlice";

const useFetchLocationsLov = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const fetchLov = async () => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/admin/getVehicleModels", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data: any = await res.json();
        console.log(data);

        // cars array
        const cars = data.cars || [];
        const models = cars.map((cur) => cur.model);
        dispatch(setModelData(models));

        const brands = cars.map((cur) => cur.brand);
        const uniqueBrands = [...new Set(brands)];
        dispatch(setCompanyData(uniqueBrands));

        // locations array
        const locationsArr = data.locations || [];
        const locations = locationsArr.map((cur) => cur.location);
        dispatch(setLocationData(locations));

        const districts = locationsArr.map((cur) => cur.district);
        const uniqueDistricts = [...new Set(districts)];
        dispatch(setDistrictData(uniqueDistricts));

        // whole data (locations)
        dispatch(setWholeData(locationsArr));
      } else {
        return "no data found";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchLov, isLoading };
};

export default useFetchLocationsLov;
