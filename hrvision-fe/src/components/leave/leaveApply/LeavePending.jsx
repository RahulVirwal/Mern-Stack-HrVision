import React, { useEffect, useState } from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import View from "../../../assets/Icon/view.svg";
import close from "../../../assets/Icon/close.svg";
import moment from "moment";
import { columnsDataOfPendingLeave } from "../../Dashboard/default/variables/columnsData";
import Cookies from "js-cookie";
import axios from "axios";
import NoDataFound from "components/NoDataFound";
import NoDataImage from "../../../assets/img/layout/nodata.jpg";
import Loader from "components/Loader/Loader";
import LeaveDetalisPage from "components/LeaveDetalisPage";

const LeavePending = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveDataT, setLeaveDataT] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const columns = columnsDataOfPendingLeave;
  const authToken = Cookies.get("jwt-token");
  const fetchLeaveData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}leave/pending`,
        {
          headers: {
            "jwt-token": authToken,
          },
        }
      );
      const jsondata = response?.data;
      if (jsondata.status === "ok") {
        setLeaveData(jsondata?.data);
      } else {
        throw new Error(jsondata.message);
      }
    } catch (error) {
      console.error("Error fetching Leaves:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLeaveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  const handleViewClick = (leaveid) => {
    const selectedLeaveData = leaveData.find((item) => item._id === leaveid);
    setLeaveDataT(selectedLeaveData);
    setIsOpen(true);
  };

  const closePage = () => {
    setIsOpen(false);
  };

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

  return (
    <div className="h-fit overflow-hidden">
      <div className="mt-8 overflow-y-hidden overflow-x-scroll lg:overflow-hidden">
        {loading ? (
          <div className="h-[60vh]">
            <Loader />
          </div>
        ) : data.length > 0 ? (
          <table
            {...getTableProps()}
            className="w-full min-w-[900px] table-auto bg-white shadow-md"
          >
            <thead className="bg-gray-300">
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className=" border-b border-gray-300 p-4 text-center text-xs font-bold uppercase tracking-wider"
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
                      let data;
                      if (cell.column.Header === "APPLICATION DATE") {
                        data = (
                          <div className="flex justify-center">
                            <p className="text-sm font-bold text-gray-700">
                              {moment(cell.value).format("DD/MM/YYYY") ?? "-"}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "LEAVE TYPE") {
                        data = (
                          <div className="flex justify-center pr-2">
                            <p className="text-sm font-bold capitalize text-gray-700">
                              {cell.value ?? "-"}{" "}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "POSITION") {
                        data = (
                          <div className="flex justify-center">
                            <p className="text-sm font-bold text-gray-700">
                              {" "}
                              {cell.value ?? "-"}{" "}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "LEAVE DATE") {
                        data = (
                          <div className="flex justify-center">
                            <p className="text-sm font-bold text-gray-700">
                              {moment(cell.value).format("DD/MM/YYYY") ?? "-"}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "RETURN DATE") {
                        data = (
                          <div className="flex justify-center">
                            <p className="text-sm font-bold text-gray-700">
                              {moment(cell.value).format("DD/MM/YYYY") ?? "-"}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "TOTAL DAYS") {
                        data = (
                          <div className="flex justify-center">
                            <p className="text-sm font-bold text-gray-700">
                              {cell.value ?? "-"}{" "}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "ACTIONS") {
                        data = (
                          <div className="flex justify-center">
                            <span className="cursor-pointer">
                              <button
                                onClick={() =>
                                  handleViewClick(row.original._id)
                                }
                              >
                                <img src={View} alt="" width={20} height={20} />
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
          <NoDataFound img={NoDataImage} />
        )}
      </div>
      {isOpen && leaveDataT && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center overflow-auto backdrop-blur-sm">
          <div className="relative mx-auto max-w-lg rounded-lg border-2 border-gray-300 bg-white p-4 shadow-lg ">
            <button
              className="absolute top-1 right-2 text-gray-600 hover:text-gray-900"
              onClick={closePage}
            >
              <img src={close} alt="" className="h-6 w-6" />
            </button>
            <LeaveDetalisPage
              data={leaveDataT}
              setIsOpen={setIsOpen}
              refreshData={fetchLeaveData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePending;
