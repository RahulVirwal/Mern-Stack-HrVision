import React, { useCallback, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import moment from "moment";
import "assets/css/MiniCalendar.css";
import Button from "../button/Button";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import Regularization from "./Regularization";
import Cookies from "js-cookie";
import WeeklyAttendance from "../WeeklyAttendance/index";
import axios from "axios";

const Attendance = () => {
  const [value, setValue] = useState(new Date());
  const [btn, setBtn] = useState(false);
  const [leaveDate, setLeaveDate] = useState([]);
  const [signInTime1, setSignInTime1] = useState(null);
  const [signOutTime1, setSignOutTime1] = useState(null);
  const [signInTime2, setSignInTime2] = useState(null);
  const [signOutTime2, setSignOutTime2] = useState(null);
  const [holidays,setHolidays] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = (path) => {
    navigate(path);
  };

  const authToken = Cookies.get("jwt-token");

  const diff_minutes = (dt2, dt1) => {
    if (dt1 && dt2) {
      var diff = (dt2.getTime() - dt1.getTime()) / 1000;
      var hours = Math.floor(diff / 3600);
      var minutes = Math.floor((diff % 3600) / 60);
      return Math.abs(hours) + " H " + Math.abs(minutes) + " M";
    }
    return "-";
  };

  const holidayData = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}holiday/all`, {
        headers: {
          "jwt-token": authToken,
        },
      })
      .then((response) => {
        const jsondata = response.data;
        if (jsondata.status === "ok") {
          // Extract only the dates from the response
          const allDates = Object.values(jsondata.data).reduce((acc, holidays) => {
            holidays.forEach(holiday => {
              acc.push(moment(new Date(holiday.date)).format("YYYY-MM-DD"));
            });
            return acc;
          }, []);
          setHolidays(allDates);
        } else {
          throw new Error(jsondata.message);
        }
      })
      .catch((error) => {
        console.error("Error for Events:", error);
      })

  }, [authToken]);

  const fetchLeave = useCallback(
    async (value) => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("jwt-token", authToken || "");

        const response = await fetch(
          `${process.env.REACT_APP_BASE_API_URL}leave/monthly${
            value ? `?date=${moment(value).format("YYYY-MM-DD")}` : ""
          }`,
          {
            method: "GET",
            headers: myHeaders,
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsondata = await response.json();

        if (jsondata.status === "ok") {
          const data = jsondata?.data.map((number) =>
            moment(new Date(number)).format("YYYY-MM-DD")
          );
          setLeaveDate(data);
        } else {
          throw new Error(jsondata.message);
        }
      } catch (error) {
        console.error("error", error);
      }
    },
    [authToken]
  );

  const fetchSession = useCallback(
    async (value) => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("jwt-token", authToken || "");

        const response = await fetch(
          `${process.env.REACT_APP_BASE_API_URL}attendance${
            value ? `?date=${moment(value).format("YYYY-MM-DD")}` : ""
          }`,
          {
            method: "GET",
            headers: myHeaders,
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsondata = await response.json();

        if (jsondata.status === "ok") {
          setSignInTime1(
            jsondata?.attendance?.signInTime1
              ? new Date(jsondata?.attendance?.signInTime1)
              : null
          );
          setSignInTime2(
            jsondata?.attendance?.signInTime2
              ? new Date(jsondata?.attendance?.signInTime2)
              : null
          );
          setSignOutTime1(
            jsondata?.attendance?.signOutTime1
              ? new Date(jsondata?.attendance?.signOutTime1)
              : null
          );
          setSignOutTime2(
            jsondata?.attendance?.signOutTime2
              ? new Date(jsondata?.attendance?.signOutTime2)
              : null
          );
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    [authToken]
  );

  useEffect(() => {
    const path = location.pathname;

    if (path === "/attendance") {
      holidayData()
      const dateParam = searchParams.get("date");
      if (dateParam) {
        const date = new Date(dateParam);
        setValue(date);
        fetchLeave(date);
        fetchSession(date);
      } else {
        fetchLeave(value);
        fetchSession(value);
      }
      setBtn(false);
    }
    if (path.startsWith("/attendance/regularize")) {
      setBtn(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, searchParams]);

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setValue(activeStartDate);
    fetchLeave(activeStartDate);
    fetchSession(activeStartDate);
    setSearchParams({ date: moment(activeStartDate).format("YYYY-MM-DD") });
  };

  const handleDateChange = (date) => {
    setValue(date);
    fetchLeave(date);
    fetchSession(date);
    setSearchParams({ date: moment(date).format("YYYY-MM-DD") });
  };

  return (
    <>
      {!btn && (
        <div className="mt-4 flex flex-col pb-4 ">
          {/* <Button
            className={`h-fit w-fit self-end `}
            _onClick={() => {
              handleClick("regularize/apply");
              setBtn(true);
            }}
          >
            My Regularizations
          </Button> */}
          <div className="flex flex-col justify-around gap-6 lg:flex-col 2xl:flex-row">
            <div className="flex h-[300px] items-center justify-center">
              <Calendar
                onChange={handleDateChange}
                value={value}
                prevLabel={<MdChevronLeft className="ml-1 h-6 w-6" />}
                nextLabel={<MdChevronRight className="ml-1 h-6 w-6" />}
                view={"month"}
                className="shadow-2xl"
                tileClassName={({ date, view }) => {
                  if (view === "month") {
                    const formattedDate = moment(date).format("YYYY-MM-DD");
                    if (leaveDate.includes(formattedDate)) {
                      return "highlight";
                    }
                    else if (holidays.includes(formattedDate)){
                      return "holiday";
                    }
                  }
                  return null;
                }}
                onActiveStartDateChange={handleActiveStartDateChange}
              />
            </div>
            <div>
              <div className="mt-4 lg:mx-auto">
                <p className="mx-0  w-full  text-start  text-xl font-bold text-blue-700 sm:mx-3 sm:text-2xl lg:text-center">
                  Session Details
                </p>
              </div>
              <div className="h-fit overflow-y-hidden">
                <div className="mt-8 overflow-y-hidden overflow-x-scroll lg:overflow-hidden">
                  <table className="w-full min-w-[900px] table-auto bg-white shadow-md 2xl:min-w-[500px]">
                    <thead className="bg-gray-300">
                      <tr>
                        <th className="min-w-[150px] border-b border-gray-300  p-4 text-center text-xs font-bold uppercase tracking-wider">
                          Session
                        </th>
                        <th className="min-w-[150px] border-b border-gray-300  p-4 text-center text-xs font-bold uppercase tracking-wider">
                          Session Duration (Minutes)
                        </th>
                        <th className="min-w-[150px] border-b border-gray-300  p-4 text-center text-xs font-bold uppercase tracking-wider">
                          Sign In
                        </th>
                        <th className="min-w-[150px] border-b border-gray-300  p-4 text-center text-xs font-bold uppercase tracking-wider">
                          Sign Out
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-100">
                        <td className="min-w-[150px] p-4 text-center">
                          Session 1
                        </td>
                        <td className="min-w-[150px] p-4 text-center">
                          {diff_minutes(signOutTime1, signInTime1)}
                        </td>
                        <td className="min-w-[150px] p-4 text-center">
                          {signInTime1 ? signInTime1.toLocaleTimeString() : "-"}
                        </td>
                        <td className="min-w-[150px] p-4 text-center">
                          {signOutTime1
                            ? signOutTime1.toLocaleTimeString()
                            : "-"}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-100">
                        <td className="min-w-[150px] p-4 text-center">
                          Session 2
                        </td>
                        <td className="min-w-[150px] p-4 text-center">
                          {diff_minutes(signOutTime2, signInTime2)}
                        </td>
                        <td className="min-w-[150px] p-4 text-center">
                          {signInTime2 ? signInTime2.toLocaleTimeString() : "-"}
                        </td>
                        <td className="min-w-[150px] p-4 text-center">
                          {signOutTime2
                            ? signOutTime2.toLocaleTimeString()
                            : "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <WeeklyAttendance />
        </div>
      )}

      <Routes>
        {btn && <Route path="regularize/*" element={<Regularization />} />}
      </Routes>
    </>
  );
};

export default Attendance;
