import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import axios, { all } from "axios";

import Leavecard from "components/leavecard";
import Loader from "components/Loader/Loader";

export default function Showleave() {
  const [allLeave, setAllLeave] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const authToken = Cookies.get("jwt-token");
  const userid = location.pathname
    .split("profilepage")
    .slice(1, 2)[0]
    .slice(1)
    .split("/")
    .slice(0, 1)[0];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useridData = {
    employeeId: userid,
  };
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}leave/count`,
          {
            params: useridData,
            headers: { "jwt-token": authToken || "" },
          }
        );
        if (response.data.status === "ok") {
          setAllLeave(response?.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally{
        setLoading(false);
      }
    };
    fetchEmployeeDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="h-[74vh]">
    {loading && (
        <div className="h-[60vh]">
          <Loader/>
        </div>
      )}
      {!loading &&
      <div className="mt-4 grid grid-cols-1  place-items-center md:grid-cols-2  lg:grid-cols-3 gap-y-12">
        <Leavecard
          LeaveType="Sick Leave"
          Granted={allLeave.granted_sickLeave}
          Balance={allLeave.remaining_sickLeave}
        />
        <Leavecard
          LeaveType="Paid Leave"
          Granted={allLeave.granted_paidLeave}
          Balance={allLeave.remaining_paidLeave}
        />
        <Leavecard
          LeaveType="CompOff Leave"
          Granted={allLeave.granted_CompOffLeave}
          Balance={allLeave.remaining_compOffLeave}
        />
        <Leavecard
            LeaveType="Unpaid Leave"
            Granted={allLeave.granted_unpaidLeave}
            Balance={"0"}
          />
      </div>
}
    </div>
  );
}
