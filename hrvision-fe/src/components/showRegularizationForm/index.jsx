import React from "react";
import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function RegularizationFormpage({ regularization, refreshData, setIsOpen }) {
  const authToken = Cookies.get("jwt-token");
  const updateData = async (value) => {
    const data = {
      attendanceId: regularization.attendanceId,
      status: value,
      session: regularization.session,
    };
    const projectManager = Cookies.get("projectManager");
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API_URL}${
          projectManager === "true"
            ? "forgetattendance/pmupdate"
            : "forgetattendance/update"
        }`,
        data,
        {
          headers: {
            "jwt-token": authToken || "",
          },
        }
      );
      if (response.data.status === "ok") {
        toast.success(response.data.message, "Success");
        setIsOpen(false);
        refreshData();
      } else {
        toast.error(response.data.message, "Error");
        setIsOpen(false);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating employee details:", error);
      toast.error(error.message, "Error");
    }
  };

  const handleAccept = (value) => {
    updateData(value);
  };

  return (
    <div className="mt-4 w-full sm:w-[300px]">
      <h2 className="text-3xl font-semibold text-blue-800">
        {regularization.name}
      </h2>
      <div className="mt-4 flex-col">
        <p className="font-semibold">Date</p>
        <p>{moment(regularization.date).format("DD/MM/YYYY")}</p>
        <br />
        <p className="font-semibold">Session</p>
        <p>{regularization.session}</p>
        <br />
        <p className="font-semibold">Reason</p>
        <p>{regularization.reason}</p>
      </div>
      <div className="mt-6 mr-4 flex justify-end space-x-4 md:mr-0">
        <button
          onClick={() => handleAccept("approved")}
          className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
        >
          Accept
        </button>
        <button
          onClick={() => handleAccept("rejected")}
          className="rounded-md bg-red-500 px-4 py-2  text-white shadow-sm hover:bg-red-600"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default RegularizationFormpage;
