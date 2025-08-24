import express from "express";
import pool from "../db.js"; // MySQL connection

const router = express.Router();

// POST /api/booking/create
router.post("/create", async (req, res) => {
  const { userId, vehicleId, withDriver, amount } = req.body;

  console.log(userId, vehicleId, withDriver, amount, "tets");
  if (!userId || !vehicleId || !amount) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    // Generate booking ID
    const bookingId = "BK-" + Date.now(); // simple unique ID

    // Insert into bookings table
    const [result] = await pool.execute(
      `INSERT INTO bookings 
      (booking_id, user_id, vehicle_id, with_driver, amount, status) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [bookingId, userId, vehicleId, withDriver ? 1 : 0, amount, "pending"]
    );

    res.status(200).json({
      success: true,
      bookingId,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Booking creation failed" });
  }
});

export default router;
