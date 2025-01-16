import React, { useState } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import Card from "components/card";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const employees = ["Milan Sojitra", "John Doe", "Jane Smith", "Chris Johnson"];

const EmployeeLeave = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleCalendarClick = () => {
    setIsCalendarOpen(true);
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setIsCalendarOpen(false);
  };

  return (
    <>
      <Card extra="!p-[20px] text-center">
        <div className="flex justify-between">
          <h2 className="mt-2 ml-2 text-lg font-bold text-navy-700 dark:text-white">
            Employees on leave
          </h2>
          <button
            className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80"
            onClick={handleCalendarClick}
          >
            <MdOutlineCalendarToday />
            <span className="text-sm font-medium text-gray-600">
              {date.toDateString()}
            </span>
          </button>
        </div>

        <div className="flex h-full w-full flex-row justify-center sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
          <div className="flex flex-col items-center">
            <ul className="mt-5 space-y-2">
              {employees.map((employee, index) => (
                <li
                  key={index}
                  className="divide-y divide-gray-200 text-center text-lg font-bold text-red-500"
                >
                  {employee}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {isCalendarOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ">
          <div className="relative rounded-lg bg-white p-4 shadow-lg">
            <button
              className=" top-1 right-2 text-red-600 hover:text-gray-800"
              onClick={closeCalendar}
            >
              Close
            </button>
            <Calendar onChange={handleDateChange} value={date} />
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeLeave;
