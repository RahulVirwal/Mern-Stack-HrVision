import React from "react";
import close from "assets/Icon/close.svg";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className=" relative w-fit max-w-lg rounded-lg border-2 border-gray-500 bg-white p-3 shadow-md ">
        <div className="flex justify-end">
          <button
            className=" text-black rounded-lg  hover:bg-opacity-70"
            onClick={onClose}
          >
            <img src={close} alt="" className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
