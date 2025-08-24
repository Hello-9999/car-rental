import { useState } from "react";
import Modal from "../../components/CustomModal";
import { TbEditCircle } from "react-icons/tb";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { editUserProfile, setUpdated } from "../../redux/user/userSlice";
import { useForm, Controller } from "react-hook-form";
import { MuiTelInput } from "mui-tel-input";
import { MuiOtpInput } from "mui-one-time-password-input";

import axios from "axios";
import { toast } from "react-toastify";
import { Label } from "flowbite-react";

const PhoneNumberVerify = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendOtpSucess, setIsSendOtpSucess] = useState(false);
  const { username, email, phoneNumber, adress, _id } = useSelector(
    (state) => state.user.currentUser
  );

  const dispatch = useDispatch();
  const { handleSubmit, control } = useForm({
    defaultValues: {
      phoneNumber: "",
    },
  });

  //   const editProfileData = async (data, id) => {
  //     console.log(data, "data");
  //     try {
  //       if (data) {
  //         const formData = data;
  //         dispatch(editUserProfile({ ...formData }));
  //         await fetch(`/api/user/editUserProfile/${id}`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ formData }),
  //         });
  //         // dispatch(editUserProfile(null));
  //         // dispatch(setUpdated(true));
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const handleSendVerification = async (data) => {
    setIsLoading(true);
    try {
      const cleanedNumber = data.phoneNumber.replace(/\s+/g, "");
      const res = await axios.post(
        `${import.meta.env.VITE_PRODUCTION_BACKEND_URL}/api/auth/verify-otp`,
        { clientNumber: cleanedNumber, email }
      );

      const resData = res.data;
      if (resData.status) {
        toast.success(resData.msg);
        setIsSendOtpSucess(true);
        return;
      }
    } catch (error) {
      toast.error(error.response.data.msg || "Something went Wrong !");
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyOtp = async (data) => {
    setIsLoading(true);
  };
  return (
    <>
      <button type="button" className="" onClick={() => setIsModalOpen(true)}>
        Verify Now{" "}
      </button>

      <Modal
        isOpen={isModalOpen}
        // onClose={() => setIsModalOpen(false)}
        className="bg-white mt-10 rounded-md max-w-[600px] min-w-[360px]"
      >
        {!isSendOtpSucess ? (
          <form onSubmit={handleSubmit((data) => handleSendVerification(data))}>
            <div className="p-8">
              <h2 className="text-xl font-bold mb-4">
                Verify Your Mobile Number
              </h2>
              <p className="font-medium text-gray-600">
                You have not verified your number. Please enter your number
                below and submit this form to verify it
              </p>
              {/* mui components */}

              <div className="flex flex-col mx-auto md:min-w-[500px]  gap-10 mt-7">
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <MuiTelInput
                      {...field}
                      label="Phone Number"
                      defaultCountry="NP" // or use your preferred country code
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className="mt-4 mb-4">
                <button
                  class="inline-flex items-center justify-center p-2 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100  "
                  type="button"
                  onClick={() => setIsSendOtpSucess(!isSendOtpSucess)}
                >
                  <span class="w-full text-base">Already Received Sms </span>
                  <svg
                    class="w-4 h-4 ms-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
              </div>
              <div className=" text-center items-center gap-x-2">
                <button
                  type="submit"
                  className="w-[100px] rounded-sm text-white bg-green-700 p-2"
                  disabled={isLoading}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit((data) => handleSendVerification(data))}>
            <div className="p-8">
              <h2 className="text-xl font-bold mb-4">
                Verify Your Mobile Number
              </h2>
              <p className="font-medium text-gray-600">
                Enter your code below to verify your mobile number
              </p>
              {/* mui components */}

              <p
                id="floating_helper_text"
                class="mt-4 mb-3   text-gray-700 dark:text-gray-400 font-medium"
              >
                SMS Code
              </p>

              <div className="text-center">
                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      class=" border    border-gray-300 text-gray-900 text-sm rounded-lg  w-full p-4 focus-visible:border-none  "
                      placeholder="Enter SMS Code"
                      required
                    />
                  )}
                />
              </div>
              <div className="my-4">
                <button
                  class="inline-flex items-center justify-center p-2 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100  "
                  type="button"
                  onClick={() => setIsSendOtpSucess(!isSendOtpSucess)}
                >
                  <span class="w-full text-base">Send Code for me </span>
                  <svg
                    class="w-4 h-4 ms-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
              </div>

              <div className=" text-center items-center gap-x-2">
                <button
                  type="submit"
                  className="w-[100px] rounded-sm text-white bg-green-700 p-2"
                  disabled={isLoading}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default PhoneNumberVerify;
