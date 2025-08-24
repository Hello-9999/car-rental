import { useDispatch, useSelector } from "react-redux";
import { MdCurrencyRupee } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { MdVerifiedUser } from "react-icons/md";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaIndianRupeeSign } from "react-icons/fa6";

import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { displayRazorpay } from "./Razorpay";
import { setPageLoading } from "../../redux/user/userSlice";
import { setisPaymentDone } from "../../redux/user/LatestBookingsSlice";
import { toast, Toaster } from "sonner";
import PaymentModal from "../../components/PaymentModel";
// import { toast, Toaster } from "sonner";
import axios from "axios";
export async function sendBookingDetailsEmail(
  toEmail,
  bookingDetails,
  dispatch
) {
  try {
    const sendEamil = await fetch("/api/user/sendBookingDetailsEamil", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toEmail, data: bookingDetails }),
    });
    const response = await sendEamil.json();

    if (!response.ok) {
      dispatch(setisPaymentDone(false));
      console.log("something went wrong while sending email");
      return;
    }

    return "good";
  } catch (error) {
    console.log(error);
  }
}

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "email required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Invalid email address",
    }),
  phoneNumber: z.string().min(8, { message: "phoneNumber required" }),
  adress: z.string().min(4, { message: "adress required" }),
  // pickup_district: z.string().min(1),
});

const CheckoutPage = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      coupon: "",
    },
  });
  const [pickup_location, setPickup_location] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropup_location, setDropup_location] = useState("");
  const [dropupDate, setDropupDate] = useState("");
  const [dropupTime, setDropupTime] = useState("");
  const [withDriver, setWithDriver] = useState(false);
  const [step, setStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [khaltiLoaded, setKhaltiLoaded] = useState(false);

  const isOrderSummaryValid = withDriver
    ? !!(
        pickup_location &&
        pickupDate &&
        pickupTime &&
        dropup_location &&
        dropupDate &&
        dropupTime
      )
    : !!(
        pickup_location &&
        pickupDate &&
        pickupTime &&
        dropupDate &&
        dropupTime
      );
  const handleNext = () => {
    if (!isOrderSummaryValid) {
      toast.error("Please fill all required fields before proceeding.");

      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    return setStep(1);
  };

  const navigate = useNavigate();

  const {
    pickup_district,
    // pickup_location,
    dropoff_location,
    dropofftime,
    // pickupDate,
    dropoffDate,
  } = useSelector((state) => state.bookingDataSlice);

  //latest bookings data taken from redux
  const { data, paymentDone } = useSelector(
    (state) => state.latestBookingsSlice
  );

  const currentUser = useSelector((state) => state.user.currentUser);
  console.log(currentUser, "currentUser");
  const singleVehicleDetail = useSelector(
    (state) => state.userListVehicles.singleVehicleDetail
  );
  const { isPageLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { email, phoneNumber, adress } = currentUser;
  const { price } = singleVehicleDetail;

  console.log(singleVehicleDetail, "singleVehicleDetail");
  const user_id = currentUser.id;
  const vehicle_id = singleVehicleDetail.id;
  const diffMilliseconds = new Date(dropupDate) - new Date(pickupDate);
  const Days = Math.round(diffMilliseconds / (1000 * 3600 * 24));

  //settting and checking coupon
  const [wrongCoupon, setWrongCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);

  const couponValue = watch("coupon");
  const handleCoupon = () => {
    setWrongCoupon(false);
    if (couponValue === "WELCOME50") {
      setDiscount(50);
    } else {
      setDiscount(0);
      setWrongCoupon(true);
    }
  };

  //calculateing total price after coupon
  // let totalPrice = price * Days ? Days - discount : "";
  let totalPrice = Number(price) * Number(Days) - Number(discount);

  //handle place order data
  const handlePlaceOrder = async () => {
    if (userPhoneNumber) setIsModalOpen(true);
    // const orderData = {
    //   user_id,
    //   vehicle_id,
    //   totalPrice,
    //   pickupDate: pickupDate.humanReadable,
    //   dropoffDate: dropoffDate.humanReadable,
    //   pickup_district,
    //   pickup_location,
    //   dropoff_location,
    // };
    // console.log("first");
    // try {
    //   dispatch(setPageLoading(true));
    //   const displayRazorpayResponse = await displayRazorpay(
    //     orderData,
    //     navigate,
    //     dispatch
    //   );
    //   if (!displayRazorpayResponse || !displayRazorpayResponse?.ok) {
    //     dispatch(setPageLoading(false));
    //     toast.error(displayRazorpayResponse?.message);
    //   }
    // } catch (error) {
    //   console.log(error);
    //   dispatch(setPageLoading(false));
    // } finally {
    //   dispatch(setPageLoading(false));
    // }
  };
  const handleKhaltiPay = async () => {
    if (!khaltiLoaded || !window.KhaltiCheckout) {
      console.error("Khalti script not loaded yet!");
      return;
    }
    console.log(currentUser?.id, singleVehicleDetail.id);
    try {
      // 1. Create booking
      const res = await axios.post("/api/booking/create", {
        userId: currentUser.id,
        vehicleId: singleVehicleDetail.id,
        withDriver,
        amount: totalPrice,
      });

      if (res.data.success) {
        const bookingId = res.data.bookingId;

        // 2. Open Khalti payment
        const khaltiConfig = {
          publicKey: "ca69ae256bbb4ced8723445b0c87c6ef",
          productIdentity: bookingId,
          productName: singleVehicleDetail?.car_title,
          productUrl: "http://localhost:5173/" + bookingId,
          paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING"],
          eventHandler: {
            onSuccess: async (payload) => {
              console.log(payload, "payload");
              try {
                const verifyRes = await axios.post("/api/payment/verify", {
                  token: payload.token,
                  amount: payload.amount,
                });
                if (verifyRes?.status === 200) {
                  toast.success("Payment Verified");
                }
              } catch (err) {
                console.error(err);
                alert("Payment verification failed");
              }
            },
            onError: (error) => {
              console.log("Payment error:", error);
              alert("Payment Failed!");
            },
            onClose: () => console.log("Khalti widget closed"),
          },
        };

        const khaltiCheckout = new window.KhaltiCheckout(khaltiConfig);
        khaltiCheckout.show({ amount: Number(totalPrice) * 100 }); // paisa
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEsewaPay = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/pay-with-esewa",
        {
          amount: totalPrice,
          customerEmail: email,
        }
      );

      if (response.data.success) {
        // Assuming the backend sends a redirect URL or form data
        if (response.data.redirectUrl) {
          // Redirecting to the eSewa payment page
          window.location.href = response.data.redirectUrl;
        } else if (response.data.formData) {
          // Create and submit the form dynamically if formData is provided
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"; // Use correct eSewa API endpoint

          // Dynamically add form fields from backend response
          Object.keys(response.data.formData).forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = response.data.formData[key];
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        }
      } else {
        toast.error("Error in payment request!");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Service is currently unavailable. Please try again later" ||
          "An error occurred!"
      );
    }
  };

  // const handleEsewaPay = async () => {
  //   setIsModalOpen(false); // close modal after clicking

  //   try {
  //     const paymentData = JSON.stringify({
  //       method: "esewa",
  //       amount: "100", // dynamically pass actual amount
  //       productName: "Car Rental Service",
  //       transactionId: Date.now().toString(),
  //     });
  //     const res = await axios.post(
  //       "http://localhost:3000/api/user/initiate-payment",
  //       paymentData
  //     );
  //     console.log(res, "res");
  //     if (res.status == 200) {
  //       const res = await axios.post(
  //         "http://localhost:3000/api/user/esewa-verify",
  //         paymentData
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error, "error");
  //   }
  // };

  //after payment is done in displayRazorpay function we update the paymentDone from false to true our useEffect is triggered whenever state of paymentDone or data changes
  // 5.call our sendBookingDetails function to call my sendEmailapi with recivers email and his last bookingsData

  // const handleEsewaPay = async () => {
  //   setIsModalOpen(false); // close modal after clicking

  //   try {
  //     const paymentData = {
  //       method: "esewa",
  //       amount: "100", // dynamically pass actual amount
  //       productName: "Car Rental Service",
  //       transactionId: Date.now().toString(),
  //     };

  //     const res = await axios.post(
  //       "http://localhost:3000/api/user/initiate-payment",
  //       paymentData
  //     );

  //     console.log(res, "res");

  //     if (res.status === 200) {
  //       const paymentData = res.data;

  //       // Create and submit form dynamically to eSewa gateway
  //       const form = document.createElement("form");
  //       form.method = "POST";
  //       form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

  //       const esewaPayload = {
  //         amount: paymentData.amount,
  //         tax_amount: paymentData.esewaConfig.tax_amount,
  //         total_amount: paymentData.esewaConfig.total_amount,
  //         transaction_uuid: paymentData.esewaConfig.transaction_uuid,
  //         product_code: paymentData.esewaConfig.product_code,
  //         product_service_charge:
  //           paymentData.esewaConfig.product_service_charge,
  //         product_delivery_charge:
  //           paymentData.esewaConfig.product_delivery_charge,
  //         success_url: paymentData.esewaConfig.success_url,
  //         failure_url: paymentData.esewaConfig.failure_url,
  //         signed_field_names: paymentData.esewaConfig.signed_field_names,
  //         signature: paymentData.esewaConfig.signature,
  //       };

  //       Object.entries(esewaPayload).forEach(([key, value]) => {
  //         const input = document.createElement("input");
  //         input.type = "hidden";
  //         input.name = key;
  //         input.value = String(value);
  //         form.appendChild(input);
  //       });

  //       document.body.appendChild(form);
  //       form.submit();
  //       document.body.removeChild(form);
  //     }
  //   } catch (error) {
  //     console.error("Payment initiation error:", error);
  //   }
  // };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://khalti.com/static/khalti-checkout.js";
    script.async = true;
    script.onload = () => setKhaltiLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (paymentDone && data) {
      const sendEmail = async () => {
        await sendBookingDetailsEmail(email, data, dispatch);
        dispatch(setisPaymentDone(false));
      };

      sendEmail();
    }
  }, [paymentDone, data, email, dispatch]);

  return (
    <>
      <Toaster
        toastOptions={{
          classNames: {
            error: "bg-red-500 p-5",
            success: "text-green-400 p-5",
            warning: "text-yellow-400 p-5",
            info: "bg-blue-400 p-5",
          },
        }}
      />
      <div className="grid w-full absolute top-0  sm:px-10  lg:px-20  gap-10 xl:mt-20 ">
        <div className="px-4  bg-gray w-full h-full drop-shadow-md">
          {step == 1 ? (
            <div
              className="pt-8 space-y-3 rounded-lg border border-none drop-shadow-md  px-2 py-4 sm:px-6 md:min-h-[600px]  Properties backdrop-blur-sm
             bg-white 
            flex flex-col justify-between"
            >
              <p className="text-xl font-medium">Order Summary</p>
              <p className="text-gray-400">
                Check your items. And select a suitable payment method
              </p>
              <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                <img
                  className="m-1 mt-2 h-44 w-[200px] rounded-md  drop-shadow-md  border border-sm  object-contain object-center"
                  src={singleVehicleDetail.image}
                  alt=""
                />
                <div className="flex w-full flex-col px-4 py-4">
                  <span className="font-semibold capitalize">
                    <span></span> {singleVehicleDetail.model}
                  </span>
                  <span className="float-right text-gray-400">
                    <span>Package : </span>
                    {singleVehicleDetail.base_package}
                  </span>
                  <span className="float-right text-gray-400">
                    <span></span>
                    {singleVehicleDetail.fuel_type}
                  </span>
                  <span className="float-right text-gray-400">
                    <span></span>
                    {singleVehicleDetail.transmition}
                  </span>
                  <span className="float-right text-gray-400">
                    <span></span>
                    {singleVehicleDetail.registeration_number}
                  </span>
                  <p className="text-lg font-bold flex justify-start items-center">
                    <span>
                      <MdCurrencyRupee />
                    </span>
                    {singleVehicleDetail.price}
                    <span className="text-[8px] ml-1 mt-1"> /per day</span>
                  </p>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium">
                      Driver Option
                    </label>
                    <div className="flex gap-4 items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="driverOption"
                          value="true"
                          checked={withDriver === true}
                          onChange={() => setWithDriver(true)}
                        />
                        With Driver
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="driverOption"
                          value="false"
                          checked={withDriver === false}
                          onChange={() => setWithDriver(false)}
                        />
                        Without Driver
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" cursor-pointer  rounded-lg drop-shadow-sm  border border-slate-50  p-4 mt-40 pt-10">
                <div className="flex justify-around">
                  <div className="ml-5  ">
                    <div className="mt-2 font-medium underline underline-offset-4 mb-5">
                      Pick up
                    </div>
                    <div className="mt-2 capitalize ">
                      <div className="flex gap-2 ">
                        <p className="text-black text-[14px] mt-2 leading-6 font-bold">
                          District :
                        </p>
                        <p className="text-black text-[14px] mt-2 leading-6">
                          {singleVehicleDetail
                            ? singleVehicleDetail?.district
                            : ""}
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="text-black text-[14px] mt-2 leading-6 font-bold">
                          Select Location :
                        </p>

                        <select
                          className="text-[14px] border border-gray-300 rounded-md p-2 w-full"
                          value={pickup_location || ""}
                          onChange={(e) => setPickup_location(e.target.value)}
                        >
                          <option value="">Pickup Location Not Selected</option>
                          <option value="Kathmandu">Kathmandu</option>
                          <option value="Pokhara">Pokhara</option>
                          <option value="Lalitpur">Lalitpur</option>
                          <option value="Bhaktapur">Bhaktapur</option>
                        </select>
                      </div>

                      <div className="text-[14px] flex flex-col justify-start items-start  pr-2 gap-2 ">
                        <div className="flex flex-col gap-3">
                          <div className="">
                            <p className="text-black text-[14px] mt-2 leading-6 font-bold">
                              Select Date :{" "}
                            </p>
                            <input
                              type="date"
                              className="border border-gray-300 rounded-md p-2 text-[14px] w-full"
                              value={pickupDate}
                              min={new Date().toISOString().split("T")[0]}
                              onChange={(e) => setPickupDate(e.target.value)}
                            />
                          </div>
                          <div className="">
                            {" "}
                            <p className="text-black text-[14px] mt-2 leading-6 font-bold">
                              Select Time :{" "}
                            </p>{" "}
                            <input
                              type="time"
                              className="border border-gray-300 rounded-md p-2 text-[14px] w-full"
                              value={pickupTime}
                              onChange={(e) => setPickupTime(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5">
                    <div className="mt-2 font-medium underline underline-offset-4 mb-5">
                      Drop off
                    </div>

                    {withDriver ? (
                      <>
                        <div className="flex gap-2 ">
                          <p className="text-black text-[14px] mt-2 leading-6 font-bold">
                            District :
                          </p>
                          <p className="text-black text-[14px] mt-2 leading-6">
                            {singleVehicleDetail
                              ? singleVehicleDetail?.district
                              : ""}
                            {/* {pickup_district
                        ? pickup_district
                        : "Pickup District Not selected"} */}
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="text-black text-[14px] mt-2 leading-6 font-bold">
                            Select Location :
                          </p>

                          <select
                            className="text-[14px] border border-gray-300 rounded-md p-2 w-full"
                            value={dropup_location || ""}
                            onChange={(e) => setDropup_location(e.target.value)}
                          >
                            <option value="">
                              Pickup Location Not Selected
                            </option>
                            <option value="Kathmandu">Kathmandu</option>
                            <option value="Pokhara">Pokhara</option>
                            <option value="Lalitpur">Lalitpur</option>
                            <option value="Bhaktapur">Bhaktapur</option>
                          </select>
                        </div>
                        <div className="text-[14px] flex flex-col justify-start items-start  pr-2 gap-2 ">
                          <div className="flex flex-col gap-3">
                            <div className="">
                              <p className="text-black text-[14px] mt-2 leading-6 font-bold">
                                Select Date :{" "}
                              </p>

                              <input
                                type="date"
                                className="border border-gray-300 rounded-md p-2 text-[14px] w-full"
                                value={dropupDate}
                                min={
                                  pickupDate ||
                                  new Date().toISOString().split("T")[0]
                                }
                                onChange={(e) => setDropupDate(e.target.value)}
                                disabled={!pickupDate}
                              />
                            </div>
                            <div className="">
                              {" "}
                              <p className="text-black text-[14px] mt-2 leading-6 font-bold">
                                Select Time :{" "}
                              </p>{" "}
                              <input
                                type="time"
                                className="border border-gray-300 rounded-md p-2 text-[14px] w-full"
                                value={dropupTime}
                                onChange={(e) => setDropupTime(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-2 ">
                          <p className="text-black text-[14px] mt-2 leading-6 font-bold">
                            District :
                          </p>
                          <p className="text-black text-[14px] mt-2 leading-6">
                            {singleVehicleDetail
                              ? singleVehicleDetail?.district
                              : ""}
                          </p>
                        </div>
                        <div className="flex gap-2 ">
                          <p className="text-black text-[14px] mt-2 leading-6 font-bold">
                            Select Location :
                          </p>
                          <p className="text-black text-[14px] mt-2 leading-6">
                            {pickup_location}
                          </p>
                        </div>
                        <div className="text-[14px] flex flex-col justify-start items-start  pr-2 gap-2 ">
                          <div className="flex flex-col gap-3">
                            <div className="">
                              <p className="text-black text-[14px] mt-2 leading-6 font-bold">
                                Select Date :{" "}
                              </p>

                              <input
                                type="date"
                                className="border border-gray-300 rounded-md p-2 text-[14px] w-full"
                                value={dropupDate}
                                min={
                                  pickupDate ||
                                  new Date().toISOString().split("T")[0]
                                }
                                onChange={(e) => setDropupDate(e.target.value)}
                                disabled={!pickupDate}
                              />
                            </div>
                            <div className="">
                              {" "}
                              <p className="text-black text-[14px] mt-2 leading-6 font-bold">
                                Select Time :{" "}
                              </p>{" "}
                              <input
                                type="time"
                                className="border border-gray-300 rounded-md p-2 text-[14px] w-full"
                                value={dropupTime}
                                onChange={(e) => setDropupTime(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>{" "}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 bg-gray w-full h-full drop-shadow-md">
                {/* 🔹 Order Summary Content Here */}
                <button
                  className={`mt-4 w-full bg-black text-white cursor-pointer rounded-md px-6 py-3 font-medium 
    `}
                  onClick={() => handleNext()}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0 drop-shadow-md ">
              <p className="text-xl font-medium">Payment Details</p>
              <p className="text-gray-400">
                Complete your order by providing your payment details.
              </p>

              <form onSubmit={handleSubmit(handlePlaceOrder)}>
                <div className="flex flex-col gap-y-8 my-4">
                  {/* email */}

                  <div>
                    <TextField
                      id="email"
                      label="Email"
                      variant="outlined"
                      className="w-full"
                      defaultValue={email ? email : ""}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-[10px]">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* phone */}
                  <div>
                    <TextField
                      id="phoneNumber"
                      label="Phone"
                      type="number"
                      variant="outlined"
                      className="w-full"
                      onChange={(e) => setUserPhoneNumber(e.target.value)}
                      value={userPhoneNumber}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-[10px]">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  {/* PinCode */}
                  <div>
                    <div className="flex gap-6">
                      <TextField
                        rows={4}
                        id="coupon"
                        // defaultValue={Address}
                        label={"Coupon"}
                        value={couponValue}
                        {...register("coupon")}
                        className="w-full border-none"
                        placeholder="WELCOME50 Is a valid coupon"
                        required={false}
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault(), handleCoupon();
                        }}
                      >
                        <div className="bg-black text-white px-8 py-4 rounded-md">
                          Apply
                        </div>
                      </button>
                    </div>
                    {wrongCoupon && (
                      <p className="text-red-500 text-[8px]">
                        Not a valid coupon
                      </p>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="mt-6 border-t border-b py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Rent</p>
                    <p className="font-semibold text-gray-900">{price}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Days</p>
                    <p className="font-semibold text-gray-900">{Days}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Coupon</p>
                    <p className="font-semibold text-gray-900">{discount}.00</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Total</p>
                  <p className="text-2xl font-semibold text-gray-900 flex items-center justify-center">
                    <span>
                      <FaIndianRupeeSign />{" "}
                    </span>
                    {totalPrice}
                  </p>
                </div>

                {isPageLoading ? (
                  <button
                    className={`mt-4 mb-8 w-full rounded-md bg-gray-400 px-6 py-3 font-medium text-black`}
                    disabled
                  >
                    Processing ...
                  </button>
                ) : (
                  <div className="flex p-5 gap-5">
                    <button
                      onClick={() => handleBack()}
                      className={`mt-4 mb-8 w-full rounded-md bg-red-900 px-6 py-3 font-medium text-white`}
                    >
                      {"Back"}
                    </button>
                    <button
                      onClick={() => handlePlaceOrder()}
                      className={`mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white`}
                    >
                      {"Pay Now"}
                    </button>

                    <PaymentModal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      onKhaltiPay={handleKhaltiPay}
                      onEsewaPay={handleEsewaPay}
                    />
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
