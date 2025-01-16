import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LeaveApply from "./LeaveApply";
import LeavePending from "./LeavePending";
import LeaveHistory from "./LeaveHistory";
import Button from "components/button/Button";
import LeaveCard from "../../leavecard/index";
import Cookies from "js-cookie";
import axios from "axios";
import Loader from "components/Loader/Loader";

const Leave = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState({});
  const authToken = Cookies.get("jwt-token");
  const myHeaders = new Headers();
  myHeaders.append("jwt-token", authToken || "");

  useEffect(() => {
    const path = location.pathname;
    if (path === "/leave/apply") {
      setActiveComponent("apply");
    } else if (path === "/leave/pending") {
      setActiveComponent("pending");
    } else if (path === "/leave/history") {
      setActiveComponent("history");
    } else {
      setActiveComponent(null);
    }

    const fetchLeaveData = async () => {
      axios
        .get(`${process.env.REACT_APP_BASE_API_URL}leave/count`, {
          headers: {
            "jwt-token": authToken,
          },
        })
        .then((response) => {
          const jsondata = response?.data;
          if (jsondata.status === "ok") {
            setCardData(jsondata);
          } else {
            throw new Error(jsondata.message);
          }
        })
        .catch((error) => {
          console.error("Error for Leaves:", error);
        })
        .finally(()=>{
          setLoading(false);
        });
    };
    fetchLeaveData();
  }, [location.pathname, authToken]);

  const handleClick = (path) => {
    navigate(`/leave/${path}`);
  };
  return (
    <div className="min-h-[83vh] w-full overflow-y-auto overflow-x-hidden">
      <div className="mt-2 grid grid-cols-2 items-center justify-center sm:flex">
        <Button
          className={`${activeComponent === "apply" ? "bg-gray-500" : ""}`}
          _onClick={() => {
            handleClick("apply");
          }}
        >
          <div>Apply</div>
        </Button>
        <Button
          className={`${activeComponent === "pending" ? "bg-gray-500" : ""}`}
          _onClick={() => {
            handleClick("pending");
          }}
        >
          <div>Pending</div>
        </Button>
        <Button
          className={`${activeComponent === "history" ? "bg-gray-500" : ""}`}
          _onClick={() => {
            handleClick("history");
          }}
        >
          <div>History</div>
        </Button>
      </div>
      {loading && (
        <div className="h-[60vh]">
          <Loader/>
        </div>
      )}
      {activeComponent === null && !loading && (
        <div className="mt-4 grid grid-cols-1 place-items-center md:grid-cols-2 xl:grid-cols-3 gap-y-12">
          <LeaveCard
            LeaveType="Sick Leave"
            Granted={cardData.granted_sickLeave}
            Balance={cardData.remaining_sickLeave}
          />
          <LeaveCard
            LeaveType="Paid Leave"
            Granted={cardData.granted_paidLeave}
            Balance={cardData.remaining_paidLeave}
          />
          <LeaveCard
            LeaveType="CompOff Leave"
            Granted={cardData.granted_CompOffLeave}
            Balance={cardData.remaining_compOffLeave}
          />
          <LeaveCard
            LeaveType="Unpaid Leave"
            Granted={cardData.granted_unpaidLeave}
            Balance={"0"}
          />
        </div>
      )}
      <Routes>
        <Route path="apply" element={<LeaveApply />} />
        <Route path="pending" element={<LeavePending />} />
        <Route path="history" element={<LeaveHistory />} />
      </Routes>
    </div>
  );
};

export default Leave;
