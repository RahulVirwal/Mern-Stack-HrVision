import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { toast } from "react-toastify";

function LeaveDetalisPage({ data, refreshData, setIsOpen }) {
  const handleAccept = async () => {
    const authToken = Cookies.get("jwt-token");
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_API_URL}leave/delete`,
        {
          headers: {
            "jwt-token": authToken,
          },
          params: {
            id: data._id,
          },
        }
      );

      if (response.status === 200 && response.data.status === "ok") {
        toast.success("Leave request withdraw successfully!");
        setIsOpen(false);
        refreshData();
      } else {
        toast.error("Failed to withdraw leave request.");
      }
    } catch (error) {
      toast.error("Error: Unable to withdraw leave request.");
    }
  };

  return (
    <div className="mt-2 flex h-full items-center justify-center  overflow-y-auto overflow-x-hidden text-gray-700">
      <div className=" flex h-[450px] w-[250px] flex-col space-y-6  bg-white md:h-full md:w-[400px] ">
        <div>
          <h2 className="text-2xl font-semibold  text-blue-800">
            Withdrawal Leave
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
              {data.fromSession1 === "true" ? "Session 1" : "Session 2"}
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-800">Return Date</h4>
            <p className="text-sm">{new Date(data.toDate).toDateString()}</p>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-800">To Session</h4>
            <p className="text-sm">
              {data.endSession1 === "true" ? "Session 1" : "Session 2"}
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-800 ">Leave Type</h4>
            <p className="text-sm capitalize">{data.leaveType}</p>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-800">Days</h4>
            <p className="text-sm">{data.leaveDays}</p>
          </div>
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-800">Reason</h4>
          <p className="break-words text-base capitalize">{data.reason}</p>
        </div>
        <div className="mt-6 mr-4 flex justify-end space-x-4 md:mr-0">
          <button
            onClick={() => handleAccept("approved")}
            className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
          >
            Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeaveDetalisPage;
