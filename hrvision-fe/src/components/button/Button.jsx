import React from "react";

const Button = (props) => {
    const {className,_onClick,disabled} = props
  return (
    <button
      type="button"
      onClick={()=>_onClick()}
      disabled={disabled}
      className={`mb-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white me-2 hover:bg-blue-500  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${disabled ? "bg-gray-500 hover:bg-gray-500" : ""} ${className}`}
    >
        {props.children}
    </button>
  );
};

export default Button;
