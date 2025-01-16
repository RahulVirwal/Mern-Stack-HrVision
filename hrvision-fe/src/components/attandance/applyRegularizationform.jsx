import React, { useState } from "react";
import view from "../../assets/img/avatars/Person.jpg";
import Cookies from "js-cookie";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

const ApplyRegularizationform = ({ selectedDate, regularizationData }) => {
  const [remarks, setRemarks] = useState("");
  const [session, setSession] = useState("FullDay");
  const [errors, setErrors] = useState({});
  const authToken = Cookies.get("jwt-token");

  const validate = () => {
    const newErrors = {};
    if (!remarks.trim()) newErrors.remarks = "Remarks are required";
    if (!session.trim()) newErrors.session = "Session is required";
    return newErrors;
  };

  const updateData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}forgetattendance/apply`,
        {
          date: selectedDate,
          reason: remarks,
          session,
        },
        {
          headers: {
            "jwt-token": authToken || "",
          },
        }
      );
      if (response.data.status === "ok") {
        toast.success(response.data.message, "Success");
      } else {
        toast.error(response.data.message, "Reject");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message, "Error");
      console.error("Error updating employee details:", error);
    }
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateData();
    setRemarks("");
    setSession("FullDay");
    setErrors({});
  };

  const isDateIncluded =
    selectedDate &&
    regularizationData &&
    regularizationData.includes(
      moment(new Date(selectedDate)).format("DD-MM-YYYY")
    );

  return (
    <div className="flex h-[310px] w-[280px] items-center justify-center sm:w-[380px]">
      <div className="relative flex w-full max-w-lg flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm">
        <div className="absolute top-4 left-4 flex items-center space-x-4">
          <div className="relative h-16 w-16">
            <img
              src={view}
              alt="User Avatar"
              className="h-full w-full rounded-full border-2 border-gray-300 transition duration-300 hover:border-blue-500"
            />
          </div>
          <div>
            <select
              className="mr-2 rounded border p-2"
              name="session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            >
              <option value="Session1">Session 1</option>
              <option value="Session2">Session 2</option>
              <option value="FullDay">Full Day</option>
            </select>
            {errors.session && (
              <div className="text-sm text-red-500">{errors.session}</div>
            )}
          </div>
        </div>
        <div className="mt-20 mb-4 w-full">
          <textarea
            name="remarks"
            placeholder="Enter your remarks here..."
            className="form-control w-full rounded border p-2 text-base"
            maxLength="1000"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            style={{ overflow: "hidden", height: "125px" }}
          />
          {errors.remarks && (
            <div className="text-sm text-red-500">{errors.remarks}</div>
          )}
        </div>
        <button
          disabled={!isDateIncluded}
          onClick={handleSubmit}
          className={`rounded  ${
            !isDateIncluded
              ? "bg-gray-500 hover:bg-gray-500"
              : "cursor-pointer bg-blue-500 hover:bg-blue-700"
          } py-2 px-4 text-white  `}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ApplyRegularizationform;
