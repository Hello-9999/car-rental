import { useDispatch, useSelector } from "react-redux";
import ProfileEdit from "../pages/user/ProfileEdit";
import toast, { Toaster } from "react-hot-toast";
import { setUpdated } from "../redux/user/userSlice";
import { useEffect } from "react";
import PhoneNumberVerify from "../pages/user/VerifyPhoneNumber";
import TermsConditon from "../pages/user/TermsConditon";
import { useState } from "react";

const UserProfileContent = () => {
  const {
    email,
    username,
    profilePicture,
    phoneNumber,
    adress,
    isPhoneNumberVerified,
    isVendor,
  } = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const isUpdated = useSelector((state) => state.user.isUpdated);
  const handleSwitchVendorAccount = () => {
    // if (!isPhoneNumberVerified) {
    //   return toast.error(
    //     "To Switch  on  vendor account first you have to verified  your phone number !"
    //   );
    // }
    // setIsTermsConditionModalOpen(true);
  };

  useEffect(() => {
    if (isUpdated) {
      toast.success("Successfully updated");
      dispatch(setUpdated(false));
    }
  }, [isUpdated, dispatch]);
  console.log(
    isPhoneNumberVerified,
    isVendor,
    "email, username, profilePicture, phoneNumber, adress"
  );

  return (
    <div className="px-4 mx-auto mt-12  bg-white w-full sm:px-6 lg:px-8">
      <Toaster />
      {isPhoneNumberVerified == 0 ? (
        <div
          class="flex items-center justify-between p-4 mb-4 text-sm text-yellow-700 rounded-lg bg-gray-200  "
          role="alert"
        >
          <div className="flex items-center">
            {" "}
            <svg
              class="shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span class="sr-only">Info</span>
            <div>
              <span class="font-medium">
                Your mobile number has not been verified. Please Verify Now{" "}
              </span>
            </div>{" "}
          </div>

          <button
            type="button"
            class="text-white bg-green-700 hover:bg-green-800    font-medium rounded-lg text-sm px-5 py-2.5 mx-5  dark:bg-green-600 dark:hover:bg-green-700    "
          >
            <PhoneNumberVerify />
          </button>
        </div>
      ) : (
        ""
      )}

      <div className="bg-white md:mx-auto rounded shadow-xl w-full  overflow-hidden">
        <div className="h-[140px] bg-gradient-to-r from-cyan-500 to-blue-500"></div>
        <div className="px-5 py-2 flex flex-col gap-3 pb-6">
          <div className="h-[90px] relative shadow-md w-[90px] rounded-full border-4  -mt-14 border-white">
            <img
              src={profilePicture}
              alt="profile_picture"
              className="w-full h-full rounded-full object-center object-cover"
            />
            <div className="absolute bottom-0 left-[60px] z-10 ">
              <div type="button" className=" p-3">
                <ProfileEdit />
              </div>
            </div>
          </div>
          <div className="flex justify-between flex-wrap">
            <div className="">
              <h3 className="text-xl text-slate-900 relative font-bold leading-6">
                {username}
              </h3>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
            <div className="switch_vendor_btn">
              {!isVendor ? (
                <button
                  type="button"
                  class="text-white bg-green-700 hover:bg-green-800    font-medium rounded-lg text-sm px-5 py-2.5 mx-5  dark:bg-green-600 dark:hover:bg-green-700    "
                  onClick={() => handleSwitchVendorAccount()}
                >
                  <TermsConditon />
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium leading-1 mb-2">
              User Informations
            </h4>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm text-gray-600  ">
                {/* Adress:{(adress && adress) || ""} */}
                <span> Phone Number : {phoneNumber || ""} </span>
                {isPhoneNumberVerified == 0 ? (
                  <span className="bg-yellow-100   text-yellow-900 text-xs font-semibold me-2 px-2.5 py-0.5 rounded-sm  dark:text-yellow-400 border border-yellow-400 inline-flex items-center justify-center">
                    Not Verified
                  </span>
                ) : (
                  ""
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileContent;
