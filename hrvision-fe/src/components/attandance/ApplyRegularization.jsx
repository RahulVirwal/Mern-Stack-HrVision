import React, { useCallback, useEffect, useState } from "react";
import ApplyRegularizationform from "./applyRegularizationform";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import Cookies from "js-cookie";

const ApplyRegularization = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [regularizationData, setRegularizationData] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const authToken = Cookies.get("jwt-token");
  const getRegularization = useCallback(async () => {
    const myHeaders = new Headers();
    myHeaders.append("jwt-token", authToken || "");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}forgetattendance/monthly`,
        {
          method: "GET",
          headers: myHeaders,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      if (jsonData.status === "ok") {
        const data = jsonData?.data.map((number) =>
          moment(new Date(number.date)).format("DD-MM-YYYY")
        );
        setRegularizationData(data);
      } else {
        throw new Error(jsonData.message);
      }
    } catch (error) {
      console.error("error", error);
    }
  }, [authToken]);

  useEffect(() => {
    getRegularization();
  }, [getRegularization]);

  return (
    <div className="flex items-center h-full justify-center">
      <div className="max-lg:w-4/5 mt-5 flex h-full flex-col items-center justify-center  lg:flex-row ">
        <div className="mb-5 h-[310px] w-[280px] sm:w-[380px] lg:mb-0 lg:mr-10 bg-white rounded-2xl shadow-sm">
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            tileClassName={({ date, view }) => {
              const formattedDate = moment(date).format("DD-MM-YYYY");
              if (view === "month") {
                if (regularizationData.includes(formattedDate)) {
                  if (moment(date).isSame(selectedDate, "day")) {
                    return "highlight selected";
                  }
                  return "highlight";
                }
                if (moment(date).isSame(selectedDate, "day")) {
                  return "selected";
                }
              }
              return null;
            }}
          />
        </div>

        <div className="h-[310px] w-[280px] sm:w-[380px] lg:w-full">
          <ApplyRegularizationform
            selectedDate={selectedDate}
            regularizationData={regularizationData}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplyRegularization;
