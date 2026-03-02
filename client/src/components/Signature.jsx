import React from "react";
import saifSignature from "../assets/saif.png"; 

const Signature = () => {
  return (
    <div className="flex justify-end mt-4">
      <img
        src={saifSignature}
        alt="Saif Ahmad Signature"
        className="w-52 h-auto object-contain"
      />
    </div>
  );
};

export default Signature;