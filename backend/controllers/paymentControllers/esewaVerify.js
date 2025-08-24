export const esewaVerify = async (req, res) => {
  const { amt, pid, scd } = req.body; // data sent by eSewa after payment

  // Call verification API
  const params = new URLSearchParams();
  params.append("amt", amt);
  params.append("pid", pid);
  params.append("scd", scd);

  const verificationResponse = await fetch(
    "https://esewa.com.np/epay/transrec",
    {
      method: "POST",
      body: params,
    }
  );

  const verificationText = await verificationResponse.text();

  if (verificationText.includes("Success")) {
    // Payment is successful
    // TODO: Update order status in DB or any other logic
    res.send("Payment Successful! Thank you for your order.");
  } else {
    // Payment failed or not confirmed
    res.send("Payment failed or could not be verified.");
  }
};
