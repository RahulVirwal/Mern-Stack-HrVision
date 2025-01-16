import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card from "components/card";
import Cookies from "js-cookie";
import axios from "axios";
import { columnsLeaveCheck } from "../Dashboard/default/variables/columnsData";
import moment from "moment";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Loader from "components/Loader/Loader";

const TodayLeave = () => {
  const [loading, setLoading] = useState(true);
  const authToken = Cookies.get("jwt-token");
  const [allempData, setAllempData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchEmployeeLeaveData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}leave/byday`,
        {
          headers: {
            "jwt-token": authToken || "",
          },
        }
      );
      if (response.data.status === "success") {
        const validData = response.data.data.filter((item) => item !== null);
        const userData = validData.map((item) => item.user_data);
        const leaveData = validData.map((item) => item.leave_data);
        setAllempData(userData);
        setAttendanceData(leaveData);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchEmployeeLeaveData();
  }, [authToken, fetchEmployeeLeaveData]);

  const tableData = useMemo(() => {
    return attendanceData.map((att, index) => ({
      name: allempData[index]?.name || "",
      position: allempData[index]?.position || "",
      progress: att.leaveDays,
      date: att.fromDate,
    }));
  }, [allempData, attendanceData]);

  const columns = columnsLeaveCheck;
  const data = tableData;

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
    <>
      <Card extra={"w-full h-[350px] lg:h-[425px] px-6"}>
        <div>
          <header className="relative pt-4 text-start tracking-wider">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Employee Leave On Today
            </div>
          </header>
        </div>

        <div className="mt-8 overflow-x-auto overflow-y-hidden xl:h-[350px] 2xl:overflow-x-hidden">
          {loading ? (
            <div className="mt-[-40%] flex h-screen items-center  justify-center">
              <Loader />
            </div>
          ) : data.length > 0 ? (
            <table {...getTableProps()} className="mx-auto w-full table-auto">
              <thead>
                {headerGroups.map((headerGroup, index) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column, index) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className=" min-w-[140px] border-b border-gray-200 pr-16 pb-[10px]  text-center tracking-wider dark:!border-navy-700"
                        key={index}
                      >
                        <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                          {column.render("Header")}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={index}>
                      {row.cells.map((cell, index) => {
                        let data = "";
                        if (cell.column.Header === "NAME") {
                          data = (
                            <div className="min-w-[140px] pl-5 md:pl-8 lg:pl-5 3xl:pl-9 ">
                              <p className="text-sm font-bold text-navy-700 dark:text-white">
                                {cell.value}
                              </p>
                            </div>
                          );
                        } else if (cell.column.Header === "TOTAL DAYS") {
                          data = (
                            <div className="min-w-[140px] pl-8 md:pl-10 lg:pl-8 3xl:pl-12">
                              <p className="text-sm font-bold text-navy-700 dark:text-white">
                                {cell.value}
                              </p>
                            </div>
                          );
                        } else if (cell.column.Header === "POSITION") {
                          data = (
                            <div className="min-w-[140px] pl-2 md:pl-6 lg:pl-2">
                              <p className="text-sm font-bold text-navy-700 dark:text-white">
                                {" "}
                                {cell.value}{" "}
                              </p>
                            </div>
                          );
                        } else if (cell.column.Header === "LEAVE DATE") {
                          data = (
                            <div className="min-w-[140px] pl-2 md:pl-4 lg:pl-2 3xl:pl-6">
                              <p className="text-sm font-bold text-navy-700 dark:text-white">
                                {moment(cell.value).format("DD/MM/YYYY")}
                              </p>
                            </div>
                          );
                        }
                        return (
                          <td
                            {...cell.getCellProps()}
                            key={index}
                            className="pt-[14px] pb-[16px] sm:text-[14px]"
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
            <div className="flex h-[200px] items-center justify-center md:h-[250px] lg:h-[280px]">
              <span className="text-lg font-bold text-gray-500">
                No Data Found
              </span>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default TodayLeave;
