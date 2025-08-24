import express from "express";
import axios from "axios";
import pool from "../db.js";

const router = express.Router();

// POST /api/payment/verify
router.post("/verify", async (req, res) => {
  const { token, amount, bookingId } = req.body;

  if (!token || !amount || !bookingId) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const response = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      {
        token,
        amount,
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    if (response.data && response.data.idx) {
      // Payment verified → update booking status
      await pool.execute(
        "UPDATE bookings SET status = ? WHERE booking_id = ?",
        ["paid", bookingId]
      );

      return res
        .status(200)
        .json({ success: true, message: "Payment verified" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res
      .status(500)
      .json({ success: false, message: "Payment verification error" });
  }
});

export default router;
