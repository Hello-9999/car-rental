import { useState } from "react";
import Modal from "../../components/CustomModal";
import { TbEditCircle } from "react-icons/tb";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import {
  editUserProfile,
  setUpdated,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useForm, Controller } from "react-hook-form";
import { MuiTelInput } from "mui-tel-input";
import { MuiOtpInput } from "mui-one-time-password-input";

import axios from "axios";
import { toast } from "react-toastify";
import { Label } from "flowbite-react";
import { idID } from "@mui/material/locale";

const TermsConditon = () => {
  const [isTermsConditionModalOpen, setIsTermsConditionModalOpen] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSendOtpSucess, setIsSendOtpSucess] = useState(false);
  const { username, email, phoneNumber, adress, _id, id } = useSelector(
    (state) => state.user.currentUser
  );

  console.log(id, email, "_id");
  //   console.log(state.user.currentUser,'_id')

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

  const handleAgreeForm = async () => {
    setIsLoading(true);
    try {
      const data = await axios.post(
        `${import.meta.env.VITE_PRODUCTION_BACKEND_URL}/api/auth/be-vendor`,
        {
          id,
        }
      );

      if (data?.data?.success) {
        setIsTermsConditionModalOpen(false);

        dispatch(signInSuccess(data?.data?.data));

        return toast.success("🎉 You are now a verified vendor!");
      }
    } catch (error) {
      console.log(error, "errr");
      console.log(error?.message, "errr");
      toast.error("Something went Wrong !");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <button
        type="button"
        className=""
        onClick={() => setIsTermsConditionModalOpen(true)}
      >
        Switch to Vendor Account{" "}
      </button>

      <Modal
        isOpen={isTermsConditionModalOpen}
        onClose={() => setIsTermsConditionModalOpen(false)}
        className="bg-white rounded-md"
      >
        <form className="text-gray-700 bg-gray-50">
          <div className="mt-6 w-[800px] p-8 ">
            <h3 className="font-semibold mb-2">Terms and Conditions</h3>
            <p>
              By using this platform, you agree to provide accurate information
              and comply with all rental policies. You confirm that the vehicle
              listed is legally owned or authorized for rent, has valid
              registration and insurance, and is in safe, working condition.
            </p>
            <p className="mt-2">
              You are responsible for all activity under your vendor account.
              Misuse, fraud, or repeated cancellations may lead to suspension.
              The platform is not liable for any damages or disputes arising
              from rentals.
            </p>
            <p className="mt-2">
              Payouts will be made after successful rental completion, minus
              applicable service fees. We reserve the right to modify these
              terms at any time.
            </p>

            <div className="btns mt-7 flex flex-wrap justify-between m-auto">
              <button
                type="button"
                className="bg-green-600 p-3 rounded-md text-white"
                onClick={() => handleAgreeForm()}
                disabled={isLoading}
              >
                Yes , I Agree
              </button>

              <button
                type="button"
                className="bg-red-600 p-3 rounded-md text-white"
                onClick={() => setIsTermsConditionModalOpen(false)}
              >
                No , I didn't
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default TermsConditon;
