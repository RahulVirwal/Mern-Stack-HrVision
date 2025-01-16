import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useState } from "react";

const WeeklyAttendance = ({ userid }) => {
  const [weeklyData, setWeeklyData] = useState("");
  const getweeklyAttendence = async () => {
    const authToken = Cookies.get("jwt-token");
    try {
      axios
        .get(
          `${process.env.REACT_APP_BASE_API_URL}attendance/weekly${
            userid ? `?employeeId=${userid}` : ""
          }`,
          {
            headers: { "jwt-token": authToken },
          }
        )
        .then((response) => response.data.data)
        .then((data) => {
          setWeeklyData(data);
        });
    } catch (error) {}
  };

  const get_diff = (time2, time1) => {
    if (time2 === null || time1 === null) {
      return "-";
    } else {
      let diff = (new Date(time2).getTime() - new Date(time1).getTime()) / 1000;
      let hours = Math.floor(diff / 3600);
      let minutes = Math.floor((diff % 3600) / 60);
      return Math.abs(hours) + " H " + Math.abs(minutes) + " M";
    }
  };

  useEffect(() => {
    getweeklyAttendence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="mx-0 mt-8 2xl:mx-auto ">
        <p className="mx-0  w-full  text-start  text-xl font-bold text-blue-700 sm:mx-3 sm:text-2xl lg:text-center">
          Weekly Attendance
        </p>
      </div>
      <div className="h-fit overflow-y-hidden">
        <div className="mt-8 overflow-y-hidden overflow-x-scroll lg:overflow-hidden">
          <table className="w-full min-w-[900px] table-auto bg-white shadow-md">
            <thead className="bg-gray-300">
              <tr>
                <th className="min-w-[150px] border-b border-gray-300  p-4 text-center text-xs font-bold uppercase tracking-wider">
                  Date
                </th>
                <th className="min-w-[150px] border-b border-gray-300  p-4 text-center text-xs font-bold uppercase tracking-wider">
                  Sign In
                </th>
                <th className="min-w-[150px] border-b border-gray-300  p-4 text-center text-xs font-bold uppercase tracking-wider">
                  Sign Out
                </th>
                <th className="min-w-[150px] border-b border-gray-300  p-4 text-center text-xs font-bold uppercase tracking-wider">
                  Session Duration (Minutes)
                </th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.length > 0 &&
                weeklyData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="min-w-[150px] p-4 text-center">
                      {moment(new Date(data.date)).format("DD/MM/YYYY")}
                    </td>
                    <td className="min-w-[150px] p-4 text-center">
                      {data?.attendance?.signInTime1
                        ? new Date(data?.attendance?.signInTime1)
                            .toTimeString()
                            .split(" ")
                            .slice(0, 1)
                        : "-"}
                    </td>
                    <td className="min-w-[150px] p-4 text-center">
                      {data?.attendance?.signOutTime2
                        ? new Date(data?.attendance?.signOutTime2)
                            .toTimeString()
                            .split(" ")
                            .slice(0, 1)
                        : "-"}
                    </td>
                    <td className="min-w-[150px] p-4 text-center">
                      {data?.attendance
                        ? get_diff(
                            data?.attendance?.signOutTime2,
                            data?.attendance?.signInTime1
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default WeeklyAttendance;
