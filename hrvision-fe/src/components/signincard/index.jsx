import React, { useState, useEffect, useCallback } from "react";
import Card from "components/card";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignInCard() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const authToken = Cookies.get("jwt-token");
  const [todayLeave, setTodayLeave] = useState(true);
  const [email, setEmail] = useState("");
  const getSignIn = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}attendance/details`,
        {
          headers: {
            "jwt-token": authToken || "",
          },
        }
      );
      if (response?.data?.status === "ok") {
        setIsSignedIn(response?.data?.signin);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching sign in details:", error);
    }
  }, [authToken]);
  const createNotification = (type, message = "Success") => {
    switch (type) {
      case "Sign In":
        toast.success("You have successfully signed in.", "Sign In");
        break;
      case "Sign Out":
        toast.success("You have successfully signed out.", "Sign Out");
        break;
      case "Error":
        toast.error(message, "Error");
        break;
      default:
        toast.info(message, "Info");
        break;
    }
  };
  const sendData = async (type) => {
    const url = type === "Sign In" ? "attendance/signin" : "attendance/signout";
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}${url}`,
        {},
        {
          headers: {
            "jwt-token": authToken || "",
          },
        }
      );

      if (response.data.status === "ok") {
        setIsSignedIn(!isSignedIn)
        createNotification(type, response.data.message);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      createNotification(
        "Error",
        error.response?.data?.message || error.message
      );
    }
  };

  const fetchTodayLeave = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}leave/byday`,
        {
          headers: { "jwt-token": authToken || "" },
        }
      );

      if (response.data.status === "success") {
        const leaveData = response.data.data;
        const userHasLeave = leaveData.some(
          (leave) => leave?.user_data?.email === email
        );
        setTodayLeave(!userHasLeave);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching today's leave details:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}user`,
        {
          headers: { "jwt-token": authToken || "" },
        }
      );

      if (response.data.status === "ok") {
        setEmail(response?.data?.data?.email);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleToggle = () => {
    if (isSignedIn) {
      sendData("Sign Out");
    } else {
      sendData("Sign In");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchTodayLeave();
    getSignIn();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Card extra="!flex-row flex-grow items-center rounded-[20px]">
      <div className="ml-4 flex h-[90px] w-auto flex-row items-center md:ml-8">
        <div className="mb-2 flex flex-col">
          <div className="text-black-500 mt-4 h-20 pt-4 text-left text-sm font-semibold">
            <h2 className="text-black-500 w-full text-left text-sm font-semibold">
              {currentDateTime.toLocaleDateString("en-GB")}
            </h2>
            <div className="w-24">{currentDateTime.toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      <div className="mr-4 flex w-full justify-end md:ml-8">
        <button
          className={`ml-2 rounded py-2 px-4 text-sm sm:text-base ${
            todayLeave
              ? "bg-blue-500 text-white"
              : "cursor-not-allowed bg-gray-500"
          }`}
          type="button"
          name="primary"
          onClick={handleToggle}
          disabled={!todayLeave}
        >
          {isSignedIn ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </Card>
  );
}
