import React, { useEffect, useState, useMemo, useCallback } from "react";
import View from "../../assets/Icon/view.svg";
import close from "../../assets/Icon/close.svg";
import moment from "moment";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import EmployeeCard from "components/employeeCard";
import Cookies from "js-cookie";
import axios from "axios";
import RegularizationFormpage from "components/showRegularizationForm";
import { MyRegularizationHeader } from "../Dashboard/default/variables/columnsData";
import NoDataFound from "components/NoDataFound";
import NoDataImage from "../../assets/img/layout/nodata.jpg";
import Loader from "components/Loader/Loader";
import AllRegularizationHistory from "components/History/AllRegularizationHistory";

const MyRegularization = () => {
  const columns = useMemo(() => MyRegularizationHeader, []);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [allempData, setAllempData] = useState([]);
  const [selectedRegularization, setSelectedRegularization] = useState(null);
  const authToken = Cookies.get("jwt-token");
  const projectManager = Cookies.get("projectManager");

  const fetchMyRegularization = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}${
          projectManager === "true"
            ? "forgetattendance/pmforgetattendance"
            : "forgetattendance/allpending"
        }`,
        {
          headers: {
            "jwt-token": authToken || "",
          },
        }
      );

      if (response.data.status === "ok") {
        setAllempData(response?.data?.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    } finally {
      setLoading(false);
    }
  }, [authToken, projectManager]);
  useEffect(() => {
    fetchMyRegularization();
  }, [authToken, fetchMyRegularization, projectManager]);

  const truncateText = (text, length = 20) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  const tableInstance = useTable(
    {
      columns,
      data: allempData,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 11;

  const handleViewClick = (attendanceId) => {
    const regularization = allempData.find(
      (item) => item.actions === attendanceId
    );
    setSelectedRegularization(regularization);
    setIsOpen(true);
  };

  const closePage = () => {
    setIsOpen(false);
  };

  return (
    <div className="h-[83vh] overflow-hidden">
      <EmployeeCard extra={""}>
        <div className="mt-4 flex justify-center space-x-4">
          <label className="flex cursor-pointer items-center space-x-2">
            <input
              type="radio"
              name="tab"
              value="pending"
              checked={selectedTab === "pending"}
              onChange={() => setSelectedTab("pending")}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">Pending</span>
          </label>
          <label className="flex cursor-pointer items-center space-x-2">
            <input
              type="radio"
              name="tab"
              value="history"
              checked={selectedTab === "history"}
              onChange={() => setSelectedTab("history")}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">History</span>
          </label>
        </div>

        <div className="mt-8 overflow-y-hidden lg:overflow-hidden">
          {loading ? (
            <div className="h-[60vh]">
              <Loader />
            </div>
          ) : selectedTab === "pending" ? (
            allempData.length > 0 ? (
              <table
                {...getTableProps()}
                className="w-full min-w-[900px] table-auto bg-white shadow-md"
              >
                <thead className="bg-gray-300">
                  {headerGroups.map((headerGroup, index) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                      {headerGroup.headers.map((column, index) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="border-b border-gray-300  p-4 text-center text-xs font-bold uppercase tracking-wider"
                          key={index}
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={index}
                        className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                      >
                        {row.cells.map((cell, index) => {
                          let data = "";
                          if (cell.column.Header === "NAME") {
                            data = (
                              <div className="flex justify-center">
                                <p className="text-sm font-bold text-gray-700">
                                  {cell.value}
                                </p>
                              </div>
                            );
                          } else if (
                            cell.column.Header === "REGULARIZATION DATE"
                          ) {
                            data = (
                              <div className="flex justify-center">
                                <p className="text-sm font-bold text-gray-700">
                                  {moment(cell.value).format("DD/MM/YYYY")}
                                </p>
                              </div>
                            );
                          } else if (cell.column.Header === "REASON") {
                            data = (
                              <div className="flex justify-center">
                                <p className="text-sm font-bold text-gray-700">
                                  <div className="group relative">
                                    <div className="cursor-pointer text-sm font-bold text-gray-700">
                                      {truncateText(cell.value)}
                                    </div>
                                    <div className="absolute bottom-full  mb-2 w-64 cursor-pointer rounded bg-gray-800 p-2 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                      {cell.value}
                                    </div>
                                  </div>
                                </p>
                              </div>
                            );
                          } else if (cell.column.Header === "SESSION") {
                            data = (
                              <div className="flex justify-center">
                                <p className="text-sm font-bold text-gray-700">
                                  <div className="group relative">
                                    <div className="cursor-pointer text-sm font-bold text-gray-700">
                                      {cell.value}
                                    </div>
                                    <div className="absolute bottom-full left-1/2 mb-2 w-64 cursor-pointer rounded bg-gray-800 p-2 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                      {cell.value}
                                    </div>
                                  </div>
                                </p>
                              </div>
                            );
                          } else if (cell.column.Header === "ACTIONS") {
                            data = (
                              <div className="flex justify-center">
                                <span className="cursor-pointer">
                                  <button
                                    onClick={() => handleViewClick(cell.value)}
                                  >
                                    <img
                                      src={View}
                                      alt=""
                                      width={20}
                                      height={20}
                                    />
                                  </button>
                                </span>
                              </div>
                            );
                          }
                          return (
                            <td
                              {...cell.getCellProps()}
                              key={index}
                              className="p-4 text-center"
                            >
                              {data}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <NoDataFound
                text={
                  "It's empty here! Your pending leave requests will appear here."
                }
                img={NoDataImage}
              />
            )
          ) : (
            <AllRegularizationHistory />
          )}
        </div>

        {isOpen && selectedRegularization && (
          <div className="bg-black fixed inset-0 z-50 flex items-center justify-center overflow-auto backdrop-blur-sm">
            <div className="relative mx-auto max-w-lg rounded-lg border-2 border-gray-300 bg-white p-4 shadow-lg ">
              <button
                className="absolute top-1 right-2 text-gray-600 hover:text-gray-900"
                onClick={closePage}
              >
                <img src={close} alt="" className="h-6 w-6" />
              </button>
              <RegularizationFormpage
                regularization={selectedRegularization}
                refreshData={fetchMyRegularization}
                setIsOpen={setIsOpen}
              />
            </div>
          </div>
        )}
      </EmployeeCard>
    </div>
  );
};

export default MyRegularization;
