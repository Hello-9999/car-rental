import React from "react";
import axios from "axios";

const KhaltiPayment = ({ amount, bookingId }) => {
  const handlePayment = () => {
    const khaltiConfig = {
      publicKey: "YOUR_PUBLIC_KEY",
      productIdentity: bookingId,
      productName: "Car Booking",
      productUrl: "http://yourwebsite.com/booking/" + bookingId,
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
      eventHandler: {
        onSuccess: async (payload) => {
          console.log("Payment success:", payload);
          try {
            const res = await axios.post("/api/payment/verify", {
              token: payload.token,
              amount: payload.amount,
            });
            if (res.data.success) {
              alert("Payment Successful!");
              // update booking status or redirect user
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
        onClose: () => {
          console.log("Khalti widget closed");
        },
      },
    };

    const khaltiCheckout = new window.KhaltiCheckout(khaltiConfig);
    khaltiCheckout.show({ amount: amount * 100 }); // amount in paisa
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-500 text-white p-2 rounded"
    >
      Pay with Khalti
    </button>
  );
};

export default KhaltiPayment;
