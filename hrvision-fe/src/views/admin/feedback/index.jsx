import React, { useEffect, useState } from "react";
import FeedbackCard from "./FeedbackCard";
import Cookies from "js-cookie";
import axios from "axios";
import NoDataFound from "components/NoDataFound";
import NoDataImage from "../../../assets/img/layout/nodata.jpg";
import Loader from "components/Loader/Loader";
import YearDropdown from "components/holidays/YearDropdown";
import MonthDropDown from "./MonthDropdown";

const currentMonth = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentYear = new Date().getFullYear();

function Index() {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth[new Date().getMonth()]); // Set initial month to the current month
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const authToken = Cookies.get("jwt-token");

  useEffect(() => {
    const fetchFeedbackData = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}feedback/all`, {
          headers: {
            "jwt-token": authToken,
          },
          params: {
            month: selectedMonth,
            year: selectedYear
          }
        });

        const jsondata = response?.data;
        if (jsondata.status === "ok") {
          setData(jsondata?.data);
        } else {
          throw new Error(jsondata.message);
        }
      } catch (error) {
        console.error("Error for Events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, [authToken, selectedMonth, selectedYear]); // Re-fetch data when selectedMonth or selectedYear changes

  return (
    <div className="min-h-[86vh]">
      <div className="flex justify-end gap-2">
        <MonthDropDown setSelectedMonth={setSelectedMonth} selectedMonth={selectedMonth} currentMonth={currentMonth} />
        <YearDropdown setSelectedYear={setSelectedYear} selectedYear={selectedYear} />
      </div>
      {loading ? (
        <div className="h-[60vh]">
          <Loader />
        </div>
      ) : data.length > 0 ? (
        <div className="grid grid-cols-1 place-items-center xl:grid-cols-2 xl:gap-2 3xl:grid-cols-3">
          {data?.map((item, index) => (
            <FeedbackCard
              key={index}
              name={item?.createdBy}
              description={item?.description}
              title={item?.title}
              date={item?.createdAt}
            />
          ))}
        </div>
      ) : (
        <NoDataFound
          text={
            "It's empty here! Your pending leave requests will appear here."
          }
          extra={"h-full mx-auto w-[70vw]"}
          img={NoDataImage}
        />
      )}
    </div>
  );
}

export default Index;
