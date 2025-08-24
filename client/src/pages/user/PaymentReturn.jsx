import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentReturn = () => {
  const [message, setMessage] = useState("");
  const [txnId, setTxnId] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const txnId = queryParams.get("txnId");
    const status = queryParams.get("status");
    setTxnId(txnId);
    setStatus(status);

    // Call backend to verify payment
    if (txnId) {
      axios
        .get(`/api/verify-payment-status?txnId=${txnId}&status=${status}`)
        .then((response) => {
          if (response.data.success) {
            setMessage("Payment Verified!");
          } else {
            setMessage("Payment Verification Failed!");
          }
        })
        .catch((error) => {
          console.error("Error verifying payment:", error);
          setMessage("Payment Verification Error!");
        });
    }
  }, []);

  return (
    <div>
      <h1>Payment Status</h1>
      <p>Transaction ID: {txnId}</p>
      <p>Status: {message}</p>
    </div>
  );
};

export default PaymentReturn;
