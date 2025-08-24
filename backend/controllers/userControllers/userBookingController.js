import mongoose from "mongoose";
import Booking from "../../models/BookingModel.js";
import { errorHandler } from "../../utils/error.js";
import Razorpay from "razorpay";
import { availableAtDate } from "../../services/checkAvailableVehicle.js";
import Vehicle from "../../models/vehicleModel.js";
import nodemailer from "nodemailer";
import pool from "../../db.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const BookCar = async (req, res, next) => {
  try {
    if (!req.body) {
      next(errorHandler(401, "bad request on body"));
    }

    const {
      user_id,
      vehicle_id,
      totalPrice,
      pickupDate,
      dropoffDate,
      pickup_location,
      dropoff_location,
      pickup_district,
      razorpayPaymentId,
      razorpayOrderId,
    } = req.body;

    const book = new Booking({
      pickupDate,
      dropOffDate: dropoffDate,
      userId: user_id,
      pickUpLocation: pickup_location,
      vehicleId: vehicle_id,
      dropOffLocation: dropoff_location,
      pickUpDistrict: pickup_district,
      totalPrice,
      razorpayPaymentId,
      razorpayOrderId,
      status: "booked",
    });
    if (!book) {
      console.log("not booked");
      return;
    }

    const booked = await book.save();
    res.status(200).json({
      message: "car booked successfully",
      booked,
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error while booking car"));
  }
};

//createing razorpay instance
export const razorpayOrder = async (req, res, next) => {
  try {
    const { totalPrice, dropoff_location, pickup_district, pickup_location } =
      req.body;

    console.log(totalPrice);
    if (
      !totalPrice ||
      !dropoff_location ||
      !pickup_district ||
      !pickup_location
    ) {
      return next(
        errorHandler(400, "Missing Required Feilds Process Cancelled")
      );
    }
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: totalPrice * 100, // amount in smallest currency unit
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error occured in razorpayorder"));
  }
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "npr" } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency,
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment failed" });
  }
};

// -------------------- -------------------

// getting vehicles without booking for selected Date and location
export const getVehiclesWithoutBooking = async (req, res, next) => {
  try {
    const { pickUpDistrict, pickUpLocation, pickupDate, dropOffDate, model } =
      req.body;

    if (!pickUpDistrict || !pickUpLocation)
      return next(errorHandler(409, "pickup District and location needed"));

    if (!pickupDate || !dropOffDate)
      return next(errorHandler(409, "pickup , dropffdate  is required"));

    // Check if pickupDate is before dropOffDate
    if (pickupDate >= dropOffDate)
      return next(errorHandler(409, "Invalid date range"));

    const vehiclesAvailableAtDate = await availableAtDate(
      pickupDate,
      dropOffDate
    );

    if (!vehiclesAvailableAtDate) {
      return res.status(404).json({
        success: false,
        message: "No vehicles available for the specified time period.",
      });
    }

    const availableVehicles = vehiclesAvailableAtDate.filter(
      (cur) =>
        cur.district === pickUpDistrict &&
        cur.location == pickUpLocation &&
        cur.isDeleted === "false"
    );

    if (!availableVehicles) {
      return res.status(404).json({
        success: false,
        message: "No vehicles available at this location.",
      });
    }

    // If there is no next middleware after this one, send the response
    if (!req.route || !req.route.stack || req.route.stack.length === 1) {
      console.log("hello");
      console.log({ success: "true", data: availableVehicles });
      return res.status(200).json({
        success: true,
        data: availableVehicles,
      });
    }

    // If there is a next middleware, pass control to it
    res.locals.actionResult = [availableVehicles, model];
    next();
  } catch (error) {
    console.log(error);
    return next(
      errorHandler(500, "An error occurred while fetching available vehicles.")
    );
  }
};

//getting all variants of a model which are not booked
export const showAllVariants = async (req, res, next) => {
  try {
    const actionResult = res.locals.actionResult;
    const model = actionResult[1];

    if (!actionResult[0]) {
      next(errorHandler(404, "no actionResult"));
    }
    const allVariants = actionResult[0].filter((cur) => {
      return cur.model === model;
    });

    res.status(200).json(allVariants);
  } catch (error) {
    next(errorHandler(500, "internal error in showAllVariants"));
  }
};

//show i if more vehcles with same model available
export const showOneofkind = async (req, res, next) => {
  try {
    const actionResult = res.locals.actionResult;

    const modelsMap = {};
    const singleVehicleofModel = [];

    if (!actionResult) {
      next(errorHandler(404, "no actionResult"));
      return;
    }

    actionResult[0].forEach((cur) => {
      if (!modelsMap[cur.model]) {
        modelsMap[cur.model] = true;
        singleVehicleofModel.push(cur);
      }
    });

    if (!singleVehicleofModel) {
      next(errorHandler(404, "no vehicles available"));
      return;
    }

    res.status(200).json(singleVehicleofModel);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error in showOneofkind"));
  }
};

//  filtering vehicles
export const filterVehicles = async (req, res, next) => {
  console.log(req.body, "reqreq");
  try {
    const filters = req.body;
    if (!filters || filters.length === 0) {
      return next(errorHandler(400, "Select filter option first"));
    }

    // Prepare arrays for filter values
    const carTypes = [];
    const transmitions = [];

    filters.forEach((cur) => {
      // if (cur.type === "car_type") {
      //   const key = Object.keys(cur).find((k) => k !== "type");
      //   if (key) carTypes.push(key);
      // }
      if (cur.type === "transmition") {
        Object.keys(cur).forEach((k) => {
          if (k !== "type" && cur[k]) transmitions.push(k);
        });
      } else {
        const key = Object.keys(cur).find((k) => k !== "type");
        if (key) carTypes.push(key);
      }
    });

    // Build WHERE conditions dynamically
    let whereClauses = [];
    const values = [];

    if (carTypes.length > 0) {
      whereClauses.push(`car_type IN (${carTypes.map(() => "?").join(",")})`);
      values.push(...carTypes);
    }

    if (transmitions.length > 0) {
      whereClauses.push(
        `transmition IN (${transmitions.map(() => "?").join(",")})`
      );
      values.push(...transmitions);
    }

    const whereSQL =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT * FROM vehicles ${whereSQL}`,
      values
    );

    if (!rows || rows.length === 0) {
      return next(errorHandler(404, "No vehicles found"));
    }

    res.status(200).json({
      status: "success",
      data: { filteredVehicles: rows },
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal server error in filterVehiclesMySQL"));
  }
};

export const findBookingsOfUser = async (req, res, next) => {
  try {
    if (!req.body) {
      next(errorHandler(409, "_id of user is required"));
      return;
    }
    const { userId } = req.body;
    const convertedUserId = new mongoose.Types.ObjectId(userId);

    const bookings = await Booking.aggregate([
      {
        $match: {
          userId: convertedUserId,
        },
      },
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $project: {
          _id: 0,
          bookingDetails: "$$ROOT",
          vehicleDetails: {
            $arrayElemAt: ["$result", 0],
          },
        },
      },
    ]);

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "internal error in findBookingOfUser"));
  }
};

//api to ge the latestbookings details
export const latestbookings = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    console.log(user_id);
    const convertedUserId = new mongoose.Types.ObjectId(user_id);

    const bookings = await Booking.aggregate([
      {
        $match: {
          userId: convertedUserId,
        },
      },
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $project: {
          _id: 0,
          bookingDetails: "$$ROOT",
          vehicleDetails: {
            $arrayElemAt: ["$result", 0],
          },
        },
      },
      {
        $sort:
          /**
           * Provide any number of field/order pairs.
           */
          {
            "bookingDetails.createdAt": -1,
          },
      },
      {
        $limit:
          /**
           * Provide the number of documents to limit.
           */
          1,
      },
    ]);

    if (!bookings) {
      res.status(404, "error no such booking");
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "internal server error in latestbookings"));
  }
};

//send booking details to user email
export const sendBookingDetailsEamil = (req, res, next) => {
  try {
    console.log("hello");
    const { toEmail, data } = req.body;
    console.log("hi");
    console.log(req.body);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const generateEmailHtml = (bookingDetails, vehicleDetails) => {
      const pickupDate = new Date(bookingDetails.pickupDate);
      const dropOffDate = new Date(bookingDetails.dropOffDate);

      return `
          <div style="font-family: Arial, sans-serif; padding: 10px;">
              <h2>Booking Details</h2>
              <hr>
              <p><strong>Booking Id:</strong> ${bookingDetails._id}</p>
              <p><strong>Total Amount:</strong> ${bookingDetails.totalPrice}</p>
              <p><strong>Pickup Location:</strong> ${
                bookingDetails.pickUpLocation
              }</p>
              <p><strong>Pickup Date:</strong> ${pickupDate.getDate()}/${
        pickupDate.getMonth() + 1
      }/${pickupDate.getFullYear()} ${pickupDate.getHours()}:${pickupDate.getMinutes()}</p>
              <p><strong>Dropoff Location:</strong> ${
                bookingDetails.dropOffLocation
              }</p>
              <p><strong>Dropoff Date:</strong> ${dropOffDate.getDate()}/${
        dropOffDate.getMonth() + 1
      }/${dropOffDate.getFullYear()} ${dropOffDate.getHours()}:${dropOffDate.getMinutes()}</p>
              <h2>Vehicle Details</h2>
              <hr>
              <p><strong>Vehicle Number:</strong> ${
                vehicleDetails.registeration_number
              }</p>
              <p><strong>Model:</strong> ${vehicleDetails.model}</p>
              <p><strong>Company:</strong> ${vehicleDetails.company}</p>
              <p><strong>Vehicle Type:</strong> ${vehicleDetails.car_type}</p>
              <p><strong>Seats:</strong> ${vehicleDetails.seats}</p>
              <p><strong>Fuel Type:</strong> ${vehicleDetails.fuel_type}</p>
              <p><strong>Transmission:</strong> ${
                vehicleDetails.transmition
              }</p>
              <p><strong>Manufacturing Year:</strong> ${
                vehicleDetails.year_made
              }</p>
          </div>
      `;
    };

    var mailOptions = {
      from: process.env.EMAIL_HOST,
      to: toEmail,
      subject: "rentaride.shop booking details",
      html: generateEmailHtml(data[0].bookingDetails, data[0].vehicleDetails),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json("Email sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "internal server error in sendBookingDetailsEmail"));
  }
};
