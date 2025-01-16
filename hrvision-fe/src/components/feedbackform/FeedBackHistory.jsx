import React, { useEffect, useState } from "react";
import FeedbackCard from "views/admin/feedback/FeedbackCard";
import Cookies from "js-cookie";
import axios from "axios";
const FeedBackHistory = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const authToken = Cookies.get("jwt-token");
  const myHeaders = new Headers();
  myHeaders.append("jwt-token", authToken || "");

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}feedback`,
          {
            headers: {
              "jwt-token": authToken,
            },
          }
        );
        const jsondata = response?.data;

        if (jsondata.status === "ok") {
          setFeedbackData(jsondata?.data);
        } else {
          throw new Error(jsondata.message);
        }
      } catch (error) {
        console.error("Error for Leaves:", error);
      }
    };
    fetchFeedbackData();
  }, [authToken]);
  const data = feedbackData;

  return (
    <>
      {data?.map((item, index) => (
        <FeedbackCard
          key={index}
          name={item?.createdBy}
          description={item?.description}
          title={item?.title}
          date={item?.createdAt}
        />
      ))}
    </>
  );
};

export default FeedBackHistory;
