import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Button from "components/button/Button";
import MyRegularization from "components/MyRegularization";
import ManageLeave from "components/manageleave";

const Alleave = () => {
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState("manageleave");
  const [activeComponent, setActiveComponent] = useState(false);
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === `/allleave`) {
        setActiveComponent(true);
        navigate("manageleave");
    } else {
      setActiveComponent(false);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="h-full w-full">
      <div className="mt-2 grid grid-cols-2 items-center justify-center sm:flex">
        {/* <Button
          className={`${activeRoute === "manageleave" ? "bg-gray-500" : ""}`}
          _onClick={() => {
            handleClick(`manageleave`);
            setActiveRoute("manageleave");
          }}
        >
          <div>Manage Leave</div>
        </Button> */}
        {/* <Button
          className={`${activeRoute === "Regularization" ? "bg-gray-500" : ""}`}
          _onClick={() => {
            handleClick(`Regularization`);
            setActiveRoute("Regularization");
          }}
        >
          <div>Regularization</div>
        </Button> */}
      </div>
      {activeComponent && <ManageLeave />}
      {!activeComponent && (
        <Routes>
          <Route path="Regularization" element={<MyRegularization />} />
          <Route path="manageleave" element={<ManageLeave />} />
        </Routes>
      )}
    </div>
  );
};

export default Alleave;
