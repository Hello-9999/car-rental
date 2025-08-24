import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  updateUser,
  deleteUser,
  signOut,
  getUser,
} from "../controllers/userControllers/userController.js";
import {
  checkAvailability,
  listAllVehicles,
  searchCar,
  showVehicleDetails,
} from "../controllers/userControllers/userAllVehiclesController.js";
import { editUserProfile } from "../controllers/userControllers/userProfileController.js";
import {
  BookCar,
  razorpayOrder,
  getVehiclesWithoutBooking,
  filterVehicles,
  showOneofkind,
  showAllVariants,
  findBookingsOfUser,
  sendBookingDetailsEamil,
  latestbookings,
} from "../controllers/userControllers/userBookingController.js";
import {
  paymentMethod,
  paywithEsewa,
  returnUrl,
} from "../controllers/paymentController.js";
import { esewaVerify } from "../controllers/paymentControllers/esewaVerify.js";

const router = express.Router();

//Removed verifyToken middleware because of (cors) unable to set and access cookie since i am using free domain from vercel

router.post("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/signout", signOut);
router.get("/getuser", getUser);
router.get("/listAllVehicles", listAllVehicles);
router.post("/showVehicleDetails", showVehicleDetails);
router.post("/editUserProfile/:id", editUserProfile);
// router.post('/searchCar',searchCar)
// router.post('/checkAvailability',checkAvailability)
// router.post("/initiate-esewa-payment",);
router.post("/razorpay", verifyToken, razorpayOrder);
router.post("/payment", razorpayOrder);
router.post("/bookCar", BookCar);
router.post("/filterVehicles", filterVehicles);
router.post(
  "/getVehiclesWithoutBooking",
  getVehiclesWithoutBooking,
  showAllVariants
);
router.post("/showSingleofSameModel", getVehiclesWithoutBooking, showOneofkind);
router.post("/findBookingsOfUser", findBookingsOfUser);
router.post("/latestbookings", latestbookings);
router.post("/sendBookingDetailsEamil", sendBookingDetailsEamil);
router.post("/initiate-payment", paymentMethod);

// router.post("/esewa-verify", esewaVerify);

router.post("/pay-with-esewa", paywithEsewa);
router.get("/return-url", returnUrl);

// router.get("/pay-with-esewa", paywithEsewa);

export default router;
