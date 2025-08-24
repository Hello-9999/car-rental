import React, { useState, useRef } from "react";

const OtpInput = ({ length, value, onChange }) => {
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const newOtp = [...value];
    newOtp[index] = e.target.value;
    onChange(newOtp.join(""));

    // Auto-focus to next input
    if (e.target.value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace to clear and move focus
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
    const newOtp = pastedData.split("");
    onChange(newOtp.join(""));

    // Focus on the last filled input
    if (newOtp.length > 0) {
      inputRefs.current[newOtp.length - 1].focus();
    }
  };

  return (
    <div className="otp-container" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength="1"
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
          className="otp-input-field"
          autocomplete="one-time-code"
        />
      ))}
    </div>
  );
};

export default OtpInput;
