import React from "react";
import Select from "../../assets/Icon/edit.svg";
import { useNavigate } from "react-router-dom";
const SelectButton = ({path}) => {
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(path);
  };
  return (
    <div>
      <button onClick={() => handleClick(path)}>
        <img src={Select} alt="Select" className="h-5 w-5 cursor-pointer " />
      </button>
    </div>
  );
};

export default SelectButton;
