import React from "react";
import close from "../../assets/Icon/close.svg"


const Modal = ({ onClose, title, children, footerContent }) => {
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-black inset-0 bg-opacity-50"></div>
      <div
        className="mx-4 w-full max-w-md rounded-lg   bg-white shadow-lg md:max-w-2xl"
        onClick={handleContentClick}
      >
        <header className=" flex items-center justify-between border-b p-4">
          <div className=" text-lg font-semibold" id="modal">
            {title || "Modal"}
          </div>
          <button className="modal-close cursor-pointer" onClick={onClose}>
          <img src={close} alt="" className="h-6 w-6" />
          </button>
        </header>
        <div className="modal-body p-4">{children}</div>
        <div className="modal-footer-container border-t p-4">
          {footerContent}
        </div>
      </div>
    </div>
  );
};

export default Modal;
