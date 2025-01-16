import React, { useEffect, useState } from "react";
import Button from "components/button/Button";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ApplyRegularization from "./ApplyRegularization";
import PendingRegularization from "./PendingRegularization";
import HistoryRegularization from "./HistoryRegularization.jsx";

const Regularization = () => {
  const [activeRoute, setActiveRoute] = useState("apply");
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    setActiveRoute(path);
  }, [location.pathname]);

  return (
    <div className="h-full w-full">
      <div className="mt-2 grid grid-cols-2 items-center justify-center sm:flex">
        <Button
          className={`${activeRoute === "apply" ? "bg-gray-500" : ""}`}
          _onClick={() => {
            setActiveRoute("apply");
            handleClick("apply");
          }}
        >
          <div>Apply</div>
        </Button>
        <Button
          className={`${activeRoute === "pending" ? "bg-gray-500" : ""}`}
          _onClick={() => {
            setActiveRoute("pending");
            handleClick("pending");
          }}
        >
          <div>Pending</div>
        </Button>
        <Button
          className={`${activeRoute === "history" ? "bg-gray-500" : ""}`}
          _onClick={() => {
            setActiveRoute("history");
            handleClick("history");
          }}
        >
          <div>History</div>
        </Button>
      </div>
     
      <Routes>
        <Route path="apply" element={<ApplyRegularization />} />
        <Route path="pending" element={<PendingRegularization />} />
        <Route path="history" element={<HistoryRegularization />} />
      </Routes>
    </div>
  );
};

export default Regularization;
