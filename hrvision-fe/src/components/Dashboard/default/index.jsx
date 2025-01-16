import WeeklyRevenue from "./components/WeeklyRevenue";
import { columnsLeaveCheck } from "./variables/columnsData";
import LeaveApprovalTable from "./components/LeaveApprovalTable";
import TodayLeave from "components/todayleave/TodayLeave";
import Widget from "components/widget/Widget";
import { MdBarChart } from "react-icons/md";
import { IoDocuments } from "react-icons/io5";
import SignInCard from "components/signincard";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { columnsRegularizationDashboard } from "./variables/columnsData";
import Regularization from "./components/Regularization";
import axios from "axios";
import EmployeePendingLeave from "./components/EmployeePendingLeave";

const Dashboard = () => {
  const [adminUser, setAdminUser] = useState(false);
  const [totalLeave, setTotalLeave] = useState(null);
  const [totalLeaveMonth, setTotalLeaveMonth] = useState(null);
  const role = Cookies.get("type");
  const authToken = Cookies.get("jwt-token");

  const fetchtotalLeave = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}user`,
        {
          headers: { "jwt-token": authToken || "" },
        }
      );
      if (response.data.status === "ok") {
        const remainingLeave = response?.data?.data?.remainingLeave;
        setTotalLeave(remainingLeave);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  }, [authToken]);

  const fetchMonthLeave = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}leave/monthly`,
        {
          headers: { "jwt-token": authToken || "" },
        }
      );
      if (response.data.status === "ok") {
        setTotalLeaveMonth(response?.data?.data.length);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching monthly leave details:", error);
    }
  }, [authToken]);

  useEffect(() => {
    if (role === "Admin") {
      setAdminUser(true);
    } else {
      setAdminUser(false);
    }
    fetchtotalLeave();
    fetchMonthLeave();
  }, [fetchMonthLeave, fetchtotalLeave, role]);
  return (
    <div className="mb-4 h-full w-full">
      {!adminUser && (
        <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Widget
            icon={<MdBarChart className="h-7 w-7" />}
            title={"Total Leaves Remaining"}
            subtitle={totalLeave}
          />
          <Widget
            icon={<IoDocuments className="h-6 w-6" />}
            title={"Leaves This Month"}
            subtitle={totalLeaveMonth}
          />
          <SignInCard />
        </div>
      )}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {(role === "HR" || adminUser) && <TodayLeave />}
        {role === "Employee" && <EmployeePendingLeave />}
        <WeeklyRevenue />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {(role === "HR" || adminUser) && (
          <>
            <LeaveApprovalTable columnsData={columnsLeaveCheck} />
            {/* <Regularization columnsData={columnsRegularizationDashboard} /> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
