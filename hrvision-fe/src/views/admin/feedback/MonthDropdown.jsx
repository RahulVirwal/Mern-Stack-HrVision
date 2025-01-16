import React, { useState } from "react";

const MonthDropDown = ({selectedMonth,currentMonth,setSelectedMonth}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectMonth = (month) => {
    setSelectedMonth(month);
    setIsOpen(false);
  };

  const years = Array.from({ length: 12 }, (_, i) => currentMonth[i++]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  

  return (
    <div className="relative inline-block text-left ">
      <button
        type="button"
        className="btn dropdown-toggle text-md inline-flex items-center rounded-lg bg-blue-600 py-2 px-4  font-medium text-white"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        style={{ maxWidth: "255px" }}
      >
        <span className="label-name" title={selectedMonth}>
          {selectedMonth}
        </span>
        {isOpen ? (
          <svg
            className="fill-current ml-2 h-4 w-4 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M14.484 12.452a1 1 0 01-1.375.08l-.08-.073L10 9.707l-2.963 2.963a1 1 0 01-1.496-1.32l.083-.094 4-4a1 1 0 011.32-.083l.094.083 4 4a1 1 0 010 1.414z" />
          </svg>
        ) : (
          <svg
            className="fill-current ml-2 h-4 w-4 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.516 7.548a1 1 0 011.375-.08l.08.073L10 10.293l2.963-2.963a1 1 0 011.496 1.32l-.083.094-4 4a1 1 0 01-1.32.083l-.094-.083-4-4a1 1 0 010-1.414z" />
          </svg>
        )}
      </button>
      {isOpen && (
        <div className="ring-black absolute right-0 mt-2 max-h-40 w-48 origin-top-right overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-opacity-5 focus:outline-none">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {years.map((month) => (
              <button
                key={month}
                onClick={() => selectMonth(month)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthDropDown;
