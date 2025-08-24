import pool from "../../db.js";
import Vehicle from "../../models/vehicleModel.js";
import { errorHandler } from "../../utils/error.js";

//Vendor vehicle request
export const fetchVendorVehilceRequests = async (req, res, next) => {
  try {
    // ✅ MySQL Query (select all vehicles where conditions are false)
    const [vendorRequests] = await pool.execute(
      `SELECT * FROM vehicles 
       WHERE isAdminApproved = 0 
       AND isDeleted = 0 
       AND isRejected = 0 
       AND isAdminAdded = 0`
    );

    if (!vendorRequests || vendorRequests.length === 0) {
      return next(errorHandler(404, "No vendor requests found"));
    }

    res.status(200).json(vendorRequests);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error while fetching vendor vehicle requests"));
  }
};

//approve Vendor reqest

export const approveVendorVehicleRequest = async (req, res, next) => {
  try {
    if (!req.body) {
      return next(errorHandler(400, "No request body found"));
    }

    const { _id } = req.body;
    if (!_id) {
      return next(errorHandler(400, "Vehicle ID (_id) is required"));
    }

    // Update isAdminApproved to true for the given vehicle ID
    const [result] = await pool.execute(
      `UPDATE vehicles SET isAdminApproved = 1 WHERE id = ?`,
      [_id]
    );

    if (result.affectedRows === 0) {
      return next(errorHandler(404, "Vehicle not found or already approved"));
    }

    // Optionally, fetch the updated record to return
    const [rows] = await pool.execute(`SELECT * FROM vehicles WHERE id = ?`, [
      _id,
    ]);

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error while approving vendor vehicle"));
  }
};

//Regect vendor vehicle
export const rejectVendorVehicleRequest = async (req, res, next) => {
  try {
    if (!req.body) {
      return next(errorHandler(400, "Bad request: required id"));
    }

    const { _id } = req.body;
    if (!_id) {
      return next(errorHandler(400, "Vehicle ID (_id) is required"));
    }

    // Update isRejected to true for the given vehicle ID
    const [result] = await pool.execute(
      `UPDATE vehicles SET isRejected = 1 WHERE id = ?`,
      [_id]
    );

    if (result.affectedRows === 0) {
      return next(errorHandler(404, "Vehicle not found or already rejected"));
    }

    // Optionally, fetch the updated record to return
    const [rows] = await pool.execute(`SELECT * FROM vehicles WHERE id = ?`, [
      _id,
    ]);

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error while rejecting vendor vehicle"));
  }
};
