// routes/esewa.js
const crypto = require("crypto");

// ⚠️ Replace with your actual eSewa credentials
const PRODUCT_CODE = "EPAYTEST"; // or the one provided by eSewa
const SECRET_KEY = "8gBm/:&EnhH.1/o"; // test secret key provided by eSewa
const SUCCESS_URL = "http://localhost:3000/success";
const FAILURE_URL = "http://localhost:3000/failure";

export const esewaPay = async (req, res) => {
  const { method, amount, productName, transactionId } = req.body;

  if (method !== "esewa") {
    return res.status(400).json({ message: "Unsupported payment method" });
  }

  const esewaConfig = {
    tax_amount: 0,
    total_amount: Number(amount),
    transaction_uuid: transactionId,
    product_code: PRODUCT_CODE,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: SUCCESS_URL,
    failure_url: FAILURE_URL,
    signed_field_names:
      "total_amount,transaction_uuid,product_code,success_url,failure_url",
  };

  const signatureBaseString = `${esewaConfig.total_amount},${esewaConfig.transaction_uuid},${esewaConfig.product_code},${esewaConfig.success_url},${esewaConfig.failure_url}`;

  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(signatureBaseString)
    .digest("base64");

  esewaConfig.signature = signature;

  res.json({
    amount,
    esewaConfig,
  });
};
