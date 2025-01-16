import React, { useState } from "react";
import Button from "components/button/Button";
import Cookies from "js-cookie";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { toast } from "react-toastify";

const LeaveApply = () => {
  const [leaveType, setLeaveType] = useState();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [fromSession, setFromSession] = useState("session 1");
  const [toSession, setToSession] = useState("session 2");
  const [contactDetails, setContactDetails] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});

  const authToken = Cookies.get("jwt-token");
  const leaveTypeOptions = [
    { value: "sick", label: "Sick Leave" },
    { value: "paid", label: "Paid Leave" },
    { value: "compOff", label: "CompOff Leave" },
    { value: "unpaid", label: "Unpaid Leave" },
  ];
  const sessionOptions = [
    { value: "session 1", label: "Session 1" },
    { value: "session 2", label: "Session 2" },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#edf2f7",
      borderColor: state.isFocused ? "#3182ce" : "#e2e8f9",
      boxShadow: state.isFocused ? "0 0 0 1px #3182ce" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#3182ce" : "#cbd5e0",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3182ce"
        : state.isFocused
        ? "#ebf8ff"
        : null,
      color: state.isSelected ? "white" : "black",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "gray",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff",
    }),
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!leaveType) newErrors.leaveType = "Leave type is required";
    if (!fromDate) newErrors.fromDate = "From date is required";
    if (!toDate) newErrors.toDate = "To date is required";
    if (!contactDetails)
      newErrors.contactDetails = "Contact details are required";
    if (contactDetails.length < 10)
      newErrors.contactDetails = "Contact Number must be 10 digit";
    if (!reason) newErrors.reason = "Reason is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = {
      leaveType: leaveType,
      fromDate: fromDate.toDateString(),
      toDate: toDate.toDateString(),
      contact: contactDetails,
      reason: reason,
    };

    if (fromDate.toDateString() === toDate.toDateString()) {
      data.fromSession1 = fromSession === "session 1" ? true : false;
      data.fromSession2 = toSession === "session 2" ? true : false;
    } else {
      data.fromSession1 = fromSession === "session 1" ? true : false;
      data.fromSession2 = fromSession === "session 2" ? true : false;
      data.toSession1 = toSession === "session 1" ? true : false;
      data.toSession2 = toSession === "session 2" ? true : false;
    }
    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}leave/apply`, data, {
        headers: { "jwt-token": authToken },
      })
      .then((response) => {
        const jsondata = response.data;
        if (jsondata.status === "ok") {
          toast.success(jsondata.message, "SUCCESS");
          handleCancel();
        } else {
          throw new Error(jsondata.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message, "ERROR");
        console.error("Error applying for leave:", error);
      });
  };

  const handleCancel = () => {
    setLeaveType("");
    setFromDate(new Date());
    setToDate(new Date());
    setFromSession("session 1");
    setToSession("session 2");
    setContactDetails("");
    setReason("");
    setErrors({});
  };

  return (
    <div className="m-auto mt-4 mb-6 h-full rounded-lg bg-white p-6 shadow-md lg:w-10/12">
      <h2 className="mb-4 text-xl font-bold">Applying for Leave</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Leave type
          </label>
          <Select
            placeholder={"Select Leave Type"}
            options={leaveTypeOptions}
            value={leaveTypeOptions.find(
              (option) => option.value === leaveType
            )}
            onChange={(selectedOption) => setLeaveType(selectedOption.value)}
            styles={customStyles}
            className="date-width mt-1 block w-full rounded-md bg-gray-100 text-base focus:border-indigo-500 focus:outline-none sm:text-sm"
          />
          {errors.leaveType && (
            <p className="mt-2 text-sm text-red-600">
              {!leaveType && errors.leaveType}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col">
            <label className=" text-sm font-medium text-gray-700">
              From date
            </label>
            <DatePicker
              selected={fromDate}
              minDate={new Date()}
              onChange={(date) => {
                setFromDate(date);
                setToDate(null);
              }}
              dateFormat="dd/MM/yyyy"
              className="mt-1 w-full  rounded-md border-gray-300 bg-gray-100 py-2 pl-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            {errors.fromDate && (
              <p className="mt-2 text-sm text-red-600">{errors.fromDate}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className=" text-sm font-medium text-gray-700">
              To date
            </label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              minDate={fromDate}
              dateFormat="dd/MM/yyyy"
              className="mt-1  w-full rounded-md border-gray-300 bg-gray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            {errors.toDate && (
              <p className="mt-2 text-sm text-red-600">{errors.toDate}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              From session
            </label>
            <Select
              options={sessionOptions}
              value={sessionOptions.find(
                (option) => option.value === fromSession
              )}
              onChange={(selectedOption) =>
                setFromSession(selectedOption.value)
              }
              styles={customStyles}
              className="mt-1 block w-full rounded-md bg-gray-100 text-base focus:border-indigo-500 focus:outline-none sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              To session
            </label>
            <Select
              options={sessionOptions}
              value={sessionOptions.find(
                (option) => option.value === toSession
              )}
              onChange={(selectedOption) => setToSession(selectedOption.value)}
              styles={customStyles}
              className="mt-1 block w-full rounded-md bg-gray-100 text-base focus:border-indigo-500 focus:outline-none sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact details
          </label>
          <input
            type="tel"
            value={contactDetails}
            placeholder={"Enter Contact Details"}
            onChange={(e) => {
              if (/^\d{0,10}$/.test(e.target.value)) {
                setContactDetails(e.target.value);
              }
            }}
            pattern="\d{10}"
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.contactDetails && (
            <p className="mt-2 text-sm text-red-600">
              {contactDetails?.length < 10 && errors?.contactDetails}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter a reason"
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          ></textarea>
          {errors.reason && (
            <p className="mt-2 text-sm text-red-600">
              {!reason && errors?.reason}
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          <Button type="submit" _onClick={handleSubmit}>
            <div>Submit</div>
          </Button>
          <Button
            type="button"
            className="rounded-md bg-gray-500 text-white hover:bg-gray-300"
            _onClick={handleCancel}
          >
            <div>Cancel</div>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveApply;
