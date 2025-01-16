import React from "react";

export default function Leavecard(props) {
  return (
    <>
      <div className={`mb-3 rounded-lg border bg-white  p-4 shadow-sm h-52 w-60 sm:h-56 sm:w-76 md:w-[80%] hover:shadow-lg`}>
        <div className="card-header mb-4 flex items-center justify-between">
          <div
            className=" text-base font-medium text-gray-600 "
            title="Earned Leave"
          >
            {" "}
            {props.LeaveType}{" "}
          </div>
          <div className="text-base text-gray-400" title="Granted: 0">
            <span className="font-normal">Balance</span>: {props.Balance}
          </div>
        </div>
        <div className="card-body box-border p-6">
          <div className=" text-center text-2xl font-normal">
            {" "}
            {props.Granted}{" "}
          </div>
          <div className="text-center text-lg font-normal  text-gray-600">
            Granted
          </div>
        </div>
      </div>
    </>
  );
}
