import React from "react";

export default function FailureEsewa() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-600">❌ Payment Failed!</h1>
      <p>Something went wrong. Please try again.</p>
    </div>
  );
}
