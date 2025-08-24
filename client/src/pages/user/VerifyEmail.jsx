import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import axios from "axios";
// import "dotenv/config";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  console.log(token, "token");
  console.log(email, "email");
  console.log(
    `${
      import.meta.env.VITE_PRODUCTION_BACKEND_API_URL
    }/auth/verify-email?token=${token}&email=${email}`
  );
  const verifyEmail = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PRODUCTION_BACKEND_API_URL
        }/auth/verify-email?token=${token}&email=${email}`
      );

      console.log(response, "response");
      if (response.data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.log(error, "err");
      setStatus("error");
    }
  };
  useEffect(() => {
    if (token && email) {
      verifyEmail();
    }
  }, [token, email]);
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {status === "loading" && (
        <>
          <Loader2 className="animate-spin" size={50} />
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle size={80} className="text-green-600 mb-4" />
          <h1 className="text-2xl font-semibold text-green-700">
            Email Verified Successfully!
          </h1>
          <a
            href="/signin"
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Go to Sign In
          </a>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle size={80} className="text-red-600 mb-4" />
          <h1 className="text-2xl font-semibold text-red-700">
            Email Verification Failed
          </h1>
          <p className="text-gray-600">The token may be invalid or expired.</p>
          <a
            href="/resend-verification"
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Resend Verification Email
          </a>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
