import React from "react";

const PaymentModal = ({ isOpen, onClose, onKhaltiPay, onEsewaPay }) => {
  if (!isOpen) return null; // don't render unless open

  return (
    <div className="fixed inset-0 flex items-center justify-center  z-50">
      {/* Modal Box */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition"
            onClick={onKhaltiPay}
          >
            Pay with Khalti
          </button>

          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
            onClick={onEsewaPay}
          >
            Pay with eSewa
          </button>
        </div>

        {/* Close Button */}
        <button
          className="mt-6 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
