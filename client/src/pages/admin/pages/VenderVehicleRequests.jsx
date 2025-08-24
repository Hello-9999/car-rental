import { GrStatusGood } from "react-icons/gr";
import { MdOutlinePending } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { IoIosEye } from "react-icons/io";

import { useDispatch, useSelector } from "react-redux";

import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import {
  setUpdateRequestTable,
  setVenodrVehilces,
  setadminVenodrRequest,
} from "../../../redux/vendor/vendorDashboardSlice";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import toast from "react-hot-toast";

const VenderVehicleRequests = () => {
  const { vendorVehicleApproved, vendorVehilces, adminVenodrRequest } =
    useSelector((state) => state.vendorDashboardSlice);
  const [open, setOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const dispatch = useDispatch();
  const fetchVendorRequest = async () => {
    try {
      const res = await fetch(`/api/admin/fetchVendorVehilceRequests`, {
        method: "GET",
      });

      if (!res.ok) {
        console.error(
          "Failed to fetch vendor vehicle requests:",
          res.statusText
        );
        return;
      }
      if (res.ok) {
        const data = await res.json();

        console.log(data, "data");
        dispatch(setVenodrVehilces(data));
        dispatch(setadminVenodrRequest(data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchVendorRequest();
  }, [dispatch]);

  //aprove vendor vehicle request
  const handleApproveRequest = async (id) => {
    // console.log(id, "id");
    try {
      dispatch(setUpdateRequestTable(id));
      const res = await fetch("/api/admin/approveVendorVehicleRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
        }),
      });

      if (!res.ok) {
        console.log("error");
      }
      const data = await res.json();
      if (res?.status === 200) {
        setOpen(false);
        fetchVendorRequest();

        toast.success("Approved  Successfully ");
      }
    } catch (error) {
      toast.error("Something Went wrong!");
      console.log(error);
    }
  };

  //reject vendor Vehilce Request
  const handleReject = async (id) => {
    try {
      const res = await fetch("/api/admin/rejectVendorVehicleRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
        }),
      });
      if (!res.ok) {
        console.log("error", res);
      }
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const rows = vendorVehilces.filter(
    (vehicle) => vehicle.isDeleted === 0 && vehicle.isAdminApproved === 0
  ); // ✅ compare as number, not string
  console.log(rows);

  const handleOpen = (vehicle) => {
    console.log(vehicle, "vehicle");
    setSelectedVehicle(vehicle);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVehicle(null);
  };
  const isVendorVehiclesEmpty = vendorVehilces && vendorVehilces.length === 0;
  return (
    <div className="  ">
      {isVendorVehiclesEmpty ? (
        <p>No requests yet</p>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="vehicle table">
            <TableHead>
              <TableRow>
                <TableCell align="center">View</TableCell>{" "}
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Register Number</TableCell>
                <TableCell align="center">Company</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Status</TableCell>
                {/* Eye Icon column */}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell align="center">
                    <VisibilityIcon
                      style={{ color: "#1976d2", cursor: "pointer" }}
                      onClick={() => handleOpen(vehicle)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <img
                      src={vehicle.image}
                      alt="vehicle"
                      style={{
                        margin: "auto",
                        width: 150,
                        height: 80,
                        borderRadius: 5,
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {vehicle.registeration_number}
                  </TableCell>
                  <TableCell align="center">{vehicle.company}</TableCell>
                  <TableCell align="center">{vehicle.name}</TableCell>
                  <TableCell align="center">
                    {!vehicle.isAdminApproved ? (
                      <div className="text-yellow-500   bg-yellow-100 p-2 rounded-lg flex items-center justify-center gap-x-1">
                        <span className="text-[10px]">Pending</span>
                        <MdOutlinePending />
                      </div>
                    ) : (
                      <div className="text-green-500   bg-green-100 p-2 rounded-lg flex items-center justify-center gap-x-1">
                        <span className="text-[10px]">Approved</span>
                        <GrStatusGood />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Vehicle Details</DialogTitle>
        <DialogContent>
          {selectedVehicle &&
            (console.log(selectedVehicle, "selectedVehicle"),
            (
              <Box
                sx={{
                  "& .MuiTextField-root": {
                    marginBottom: "1.5rem",
                    width: "100%",
                  },
                }}
              >
                {/* ✅ Section 1: Images */}
                <h2 className="text-xl font-semibold mb-4">Vehicle Images</h2>
                <div className="flex flex-wrap gap-4 mb-6">
                  <img
                    src={selectedVehicle.image}
                    // alt={`vehicle-`}
                    style={{
                      width: 150,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                </div>

                {/* ✅ Section 2: Vehicle Registration Info */}
                <h2 className="text-xl font-semibold mb-4">
                  Vehicle Registration Info
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    label="Registration Number"
                    value={selectedVehicle.registeration_number}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Company"
                    value={selectedVehicle.company}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Name"
                    value={selectedVehicle.name}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Model"
                    value={selectedVehicle.model}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Title"
                    value={selectedVehicle.title}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Base Package"
                    value={selectedVehicle.base_package}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Price"
                    value={selectedVehicle.price}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Year Made"
                    value={selectedVehicle.year_made}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Fuel Type"
                    value={selectedVehicle.fuel_type}
                    InputProps={{ readOnly: true }}
                  />
                </div>

                {/* ✅ Section 3: Vehicle Specs */}
                <h2 className="text-xl font-semibold mt-10 mb-4">
                  Vehicle Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    label="Car Type"
                    value={selectedVehicle.car_type}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Seats"
                    value={selectedVehicle.seats}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Transmission Type"
                    value={selectedVehicle.transmition}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Location"
                    value={selectedVehicle.location}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="District"
                    value={selectedVehicle.district}
                    InputProps={{ readOnly: true }}
                  />
                </div>

                {/* ✅ Section 4: Document Expiry Dates */}
                <h2 className="text-xl font-semibold mt-10 mb-4">
                  Document Expiry Dates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TextField
                    label="Insurance End"
                    value={selectedVehicle.insurance_end || "N/A"}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Registration End"
                    value={selectedVehicle.registeration_end || "N/A"}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Pollution End"
                    value={selectedVehicle.pollution_end || "N/A"}
                    InputProps={{ readOnly: true }}
                  />
                </div>
                <div className="flex justify-between flex-wrap">
                  <div className="">
                    {" "}
                    <h2 className="text-xl font-semibold mt-10 mb-4">
                      RC Book Image
                    </h2>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <img
                        src={selectedVehicle.image}
                        // alt={`vehicle-`}
                        style={{
                          width: 500,
                          height: 400,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    </div>
                  </div>
                  <div className="">
                    <h2 className="text-xl font-semibold mt-10 mb-4">
                      Insurance Image
                    </h2>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <img
                        src={selectedVehicle.insurance_image}
                        // alt={`vehicle-`}
                        style={{
                          width: 500,
                          height: 400,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mt-10 mb-4">
                  Pollution Image
                </h2>
                <div className="flex flex-wrap gap-4 mb-6">
                  <img
                    src={selectedVehicle.pollution_image}
                    // alt={`vehicle-`}
                    style={{
                      width: 500,
                      height: 400,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                </div>

                {/* ✅ Section 5: Status */}
                <h2 className="text-xl font-semibold mt-10 mb-4">Status</h2>
                <TextField
                  label="Approval Status"
                  value={
                    selectedVehicle.isAdminApproved ? "Approved" : "Pending"
                  }
                  InputProps={{ readOnly: true }}
                />
              </Box>
            ))}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Close
          </Button>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleApproveRequest(selectedVehicle?.id)}
              sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
            >
              Approve
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => handleReject(selectedVehicle?.id)}
              sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
            >
              Reject
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VenderVehicleRequests;
