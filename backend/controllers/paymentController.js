import crypto from "crypto";
import axios from "axios";
export const paymentMethod = async (req, res) => {
  const { amount, transactionId } = req.body;
  const secret = "8gBm/:&EnhH.1/q"; // Your secret key

  const payload = {
    total_amount: amount,
    transaction_uuid: transactionId,
    product_code: "EPAYTEST",
    success_url: "http://localhost:5173/success",
    failure_url: "http://localhost:5173/failure",
  };

  const signedFieldNames = [
    "total_amount",
    "transaction_uuid",
    "product_code",
    "success_url",
    "failure_url",
  ];

  // Build data string in key=value pairs joined by commas, in order:
  const dataToSign = signedFieldNames
    .map((field) => `${field}=${payload[field]}`)
    .join(",");

  // Generate signature:
  const signature = crypto
    .createHmac("sha256", secret)
    .update(dataToSign)
    .digest("base64");

  console.log(signature);

  res.json({
    amount,
    esewaConfig: {
      total_amount: amount,
      transaction_uuid: transactionId,
      product_code: "EPAYTEST",
      tax_amount: 0,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: "http://localhost:5173/success",
      failure_url: "http://localhost:3000/failure",
      signed_field_names:
        "total_amount,transaction_uuid,product_code,success_url,failure_url",
      signature,
    },
  });
};

function generateRandomString(length = 16) {
  return crypto.randomBytes(length).toString("hex");
}

function generateSignature(data, secret) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64");
}

const MERCHANT_ID = "your_sandbox_merchant_id";
const API_KEY = "your_sandbox_api_key";
const SECRET_KEY = "your_sandbox_secret_key";

// ✅ MAIN PAYMENT ROUTE
export const paywithEsewa = async (req, res) => {
  const { amount, customerEmail } = req.body;

  // Generate a unique txnId
  const txnId = "txn" + Date.now();

  // Example: Define product details (replace these with real details)
  const productCode = "EPAYTEST";
  const taxAmount = 10; // Example tax
  const totalAmount = amount + taxAmount;

  // Generate the signature for the payment
  const signatureString = `${totalAmount}|${txnId}|${productCode}`;
  const signature = crypto
    .createHmac("sha256", "8gBm/:&EnhH.1/q") // Replace with your eSewa Secret Key
    .update(signatureString)
    .digest("hex");

  const paymentData = {
    amount: amount,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    transaction_uuid: txnId,
    product_code: productCode,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: "http://localhost:5173/success", // Your frontend success URL
    failure_url: "http://localhost:5173/failure", // Your frontend failure URL
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: signature,
  };

  try {
    // Call eSewa API to initiate payment (using the form-based approach)
    const response = await axios.post(
      "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      paymentData
    );

    // Send response back to frontend
    res.json({
      success: true,
      message: "Payment request sent successfully",
      data: response.data,
    });

    // console.log(response.data, "response.data");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

export const verifyTransactionStatus = async (
  txnId,
  totalAmount,
  productCode
) => {
  const url = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${productCode}&total_amount=${totalAmount}&transaction_uuid=${txnId}`;

  try {
    const response = await axios.get(url);
    if (response.data.success) {
      console.log("Transaction verified successfully:", response.data);
      return response.data;
    } else {
      console.error("Transaction verification failed");
      return null;
    }
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return null;
  }
};

export const returnUrl = async (req, res) => {
  const { txnId, amount, status } = req.query;

  const productCode = "EPAYTEST"; // Example product code used in your payment request

  // Verify payment with eSewa
  const verificationData = await verifyTransactionStatus(
    txnId,
    amount,
    productCode
  );

  if (verificationData) {
    res.json({
      success: true,
      message: "Payment verified successfully",
      paymentDetails: verificationData,
    });
  } else {
    res.json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
