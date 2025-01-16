import React, { useEffect, useState } from "react";
import View from "../../assets/Icon/view.svg";
import close from "../../assets/Icon/close.svg";
import moment from "moment";
import { columnDataForApproveLeave } from "../Dashboard/default/variables/columnsData";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import EmployeeCard from "components/employeeCard";
import ShowLeavePage from "components/showleaveform";
import Cookies from "js-cookie";
import axios from "axios";
import NoDataFound from "components/NoDataFound";
import NoDataImage from "../../assets/img/layout/nodata.jpg";
import Loader from "components/Loader/Loader";
import AllLeaveHistory from "../History/AllLeaveHistory";

const ManageLeave = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  const authToken = Cookies.get("jwt-token");
  const projectManager = Cookies.get("projectManager");
  const fetchLeaveData = async () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}${
          projectManager === "true" ? "leave/pmleave" : "leave/pending/all"
        }`,
        {
          headers: {
            "jwt-token": authToken,
          },
        }
      )
      .then((response) => {
        const jsondata = response?.data;
        if (jsondata.status === "success") {
          setLeaveData(jsondata?.data);
        } else {
          throw new Error(jsondata.message);
        }
      })
      .catch((error) => {
        console.error("Error for Leaves:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaveData();
  }, [authToken]);

  const columns = columnDataForApproveLeave;
  const data = leaveData;

  const tableInstance = useTable(
    {
      columns,
      data,
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

  const handleViewClick = (index) => {
    setId(index);
    setIsOpen(true);
  };

  const closePage = () => {
    setIsOpen(false);
  };

  return (
    <div className="h-fit overflow-y-hidden">
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

        <div className="mt-8 overflow-y-hidden  lg:overflow-hidden">
          {loading ? (
            <div className="h-[60vh]">
              <Loader />
            </div>
          ) : selectedTab === "pending" ? (
            leaveData.length > 0 ? (
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
                          if (cell.column.Header === "APPLICATION DATE") {
                            data = (
                              <div className="flex justify-center">
                                <p className="text-sm font-bold text-gray-700">
                                  {moment(cell.value).format("DD/MM/YYYY")}
                                </p>
                              </div>
                            );
                          } else if (cell.column.Header === "NAME") {
                            data = (
                              <div className="flex justify-center">
                                <p className=" text-sm font-bold capitalize text-gray-700">
                                  {cell.value}
                                </p>
                              </div>
                            );
                          } else if (cell.column.Header === "LEAVE TYPE") {
                            data = (
                              <div className="flex justify-center">
                                <p className="text-sm font-bold capitalize text-gray-700 ">
                                  {cell.value}
                                </p>
                              </div>
                            );
                          } else if (cell.column.Header === "LEAVE DATE") {
                            data = (
                              <div className="flex justify-center">
                                <p className="text-sm font-bold text-gray-700">
                                  {moment(cell.value).format("DD/MM/YYYY")}
                                </p>
                              </div>
                            );
                          } else if (cell.column.Header === "RETURN DATE") {
                            data = (
                              <div className="flex justify-center">
                                <p className="text-sm font-bold text-gray-700">
                                  {moment(cell.value).format("DD/MM/YYYY")}
                                </p>
                              </div>
                            );
                          } else if (cell.column.Header === "TOTAL DAYS") {
                            data = (
                              <div className="flex justify-center">
                                <p className="text-sm font-bold text-gray-700">
                                  {cell.value}
                                </p>
                              </div>
                            );
                          } else if (cell.column.Header === "ACTIONS") {
                            data = (
                              <div className="flex justify-center">
                                <span className=" cursor-pointer ">
                                  <button
                                    onClick={() =>
                                      handleViewClick(row.original)
                                    }
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
            <AllLeaveHistory />
          )}
        </div>

        {isOpen && (
          <div className="bg-black fixed inset-0 z-50 flex items-center justify-center overflow-auto backdrop-blur-sm">
            <div className="relative mx-auto max-w-lg rounded-lg border-2 border-gray-300 bg-white p-4 shadow-lg">
              <button
                className="absolute top-1 right-2 text-gray-600 hover:text-gray-900"
                onClick={closePage}
              >
                <img src={close} alt="" className="h-6 w-6" />
              </button>
              <ShowLeavePage
                data={id}
                fetchData={fetchLeaveData}
                onClose={closePage}
              />
            </div>
          </div>
        )}
      </EmployeeCard>
    </div>
  );
};

export default ManageLeave;
