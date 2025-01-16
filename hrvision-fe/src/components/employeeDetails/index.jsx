import React, { useEffect, useState } from "react";
import EmployeeTable from "components/Employeetable";
import Profile from "components/allprofiledetalis";
import { Route, Routes, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Button from "../../components/button/Button";
import HistoryTable from "components/Employeetable/HistoryTable";

const EmployeeDetails = (props) => {
  const [activeComponent, setActiveComponent] = useState(false);
  const authToken = Cookies.get("jwt-token");
  const [showHistory, setShowHistory] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    if (path === "/employee-detail") {
      setActiveComponent(true);
    } else {
      setActiveComponent(false);
    }
  }, [location.pathname, authToken]);

  return (
    <>
      {activeComponent && (
        <div className="mt-5 flex justify-between">
          <div className="text-2xl font-bold">
            {showHistory?"Inactive Employees":"Active Employees"}
          </div>
          <Button
            className={`${showHistory ? "bg-gray-500" : ""}`}
            _onClick={() => {
              setShowHistory(!showHistory);
              Cookies.set("employeeStatus",showHistory)
            }}
          >
            <div>{showHistory ? "Active Employees" : "Inactive Employees"}</div>
          </Button>
        </div>
      )}
      {activeComponent && (showHistory ? <HistoryTable /> : <EmployeeTable />)}
      {!activeComponent && (
        <Routes>
          <Route path=":id/*" element={<Profile />} />
        </Routes>
      )}
    </>
  );
};

export default EmployeeDetails;
