import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { toast } from "react-toastify";

function Showleavepage({ data, fetchData, onClose }) {
  const handleAccept = async (message) => {
    const body = {
      leaveId: data._id,
      status: message,
    };
    const authToken = Cookies.get("jwt-token");
    const projectManager = Cookies.get("projectManager");

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API_URL}${
          projectManager === "true" ? "leave/pmupdate" : "leave/update"
        }`,
        body,
        {
          headers: {
            "jwt-token": authToken,
          },
        }
      );

      if (response.data.status === "ok") {
        toast.success(response.data.message, "Success");
        onClose();
        fetchData();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error for Leaves:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message, "Error");
      } else {
        toast.error("An error occurred while processing the request", "Error");
      }
    }
  };

  return (
    <div className="mt-3 flex h-full items-center justify-center  overflow-y-auto overflow-x-hidden text-gray-700">
      <div className="mt-3 flex h-[450px] w-[250px] flex-col space-y-6  bg-white md:h-full md:w-[400px] ">
        <div>
          <h2 className="text-3xl font-semibold text-blue-800">
            {data.userName}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h4 className="text-base font-bold text-gray-800">Leave Date</h4>
            <p className="text-sm">{new Date(data.fromDate).toDateString()}</p>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-800">From Session</h4>
            <p className="text-sm">
              {data.fromSession1 === true ? "session 1" : "session 2"}
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-800">Return Date</h4>
            <p className="text-sm">{new Date(data.toDate).toDateString()}</p>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-800">To Session</h4>
            <p className="text-sm">
              {data.endSession1 === true ? "session 1" : "session 2"}
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-800">Leave Type</h4>
            <p className="text-sm">{data.leaveType}</p>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-800">Days</h4>
            <p className="text-sm">{data.leaveDays}</p>
          </div>
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-800">Reason</h4>
          <p className="break-words text-base">{data.reason}</p>
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
    </div>
  );
}

export default Showleavepage;
