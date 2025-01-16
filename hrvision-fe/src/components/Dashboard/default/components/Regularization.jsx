import React, { useEffect, useMemo, useState } from "react";
import SelectButton from "components/button/SelectButton";
import Card from "components/card";
import Cookies from "js-cookie";
import axios from "axios";
import { columnsRegularizationDashboard } from "../variables/columnsData";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import moment from "moment";
import Loader from "components/Loader/Loader";

const Regularization = () => {
  const [allempData, setAllempData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const columns = columnsRegularizationDashboard;
  const [loading, setLoading] = useState(true);
  const authToken = Cookies.get("jwt-token");
  const myHeaders = new Headers();
  myHeaders.append("jwt-token", authToken || "");

  useEffect(() => {
    const fetchMyRegularization = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}forgetattendance/allpending`,
          {
            headers: {
              "jwt-token": authToken || "",
            },
          }
        );
        if (response.data.status === "ok") {
          const userData = response.data.data.map(item => item.user_data);
          const attendanceData = response.data.data.map(item => item.attendance_data);
          // console.log(attendanceData)
          // setAllempData(userData);
          setAttendanceData(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally {
        setLoading(false);
      }

    };
    fetchMyRegularization();
  }, [authToken]);
  const tableData = useMemo(() => {
    return attendanceData.map((att, index) => ({
      // name: allempData[index]?.name || "",
      name: att.userName,
      date: att.date,
      reason: att.reason,
      actions: att.attendanceId,
      session: att.session,
    }));
  }, [allempData, attendanceData]);

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
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
    <Card extra={"w-full h-[350px] lg:h-[425px] px-6"}>
      <header className="relative pt-4 text-start tracking-wider">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Employee applied for regularization
        </div>
      </header>

      <div className="mt-8 overflow-x-auto xl:h-[350px] 2xl:overflow-x-hidden overflow-y-hidden">
        {loading ? (
          <div className="mt-[-40%] flex h-screen items-center  justify-center">
            <Loader />
          </div>
        ) : tableData.length > 0 ? (
          <table {...getTableProps()} className="mx-auto w-full table-auto">
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="min-w-[140px] border-b border-gray-200 pb-[10px] pr-6 text-center tracking-wider dark:!border-navy-700"
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
            <tbody {...getTableBodyProps()} className="">
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={index} className="">
                    {row.cells.map((cell, index) => {
                      let data = "";
                      if (cell.column.Header === "NAME") {
                        data = (
                          <div className="flex min-w-[140px] items-center gap-2 pl-5 md:pl-8  lg:pl-4 3xl:pl-8 ">
                            <SelectButton path={"/allleave/Regularization"} />
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                              {cell.value}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "SESSION") {
                        data = (
                          <div className="min-w-[140px] pl-8 md:pl-12 lg:pl-8 3xl:pl-12">
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                              {cell.value}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "APPLICATION DATE") {
                        data = (
                          <div className="min-w-[140px]">
                            <p className="text-sm font-bold text-navy-700 dark:text-white pl-6 md:pl-10  lg:pl-4 3xl:pl-10">
                              {" "}
                              {moment(cell.value).format("DD/MM/YYYY")}{" "}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "APPLY DATE") {
                        data = (
                          <div className="min-w-[140px] pl-6 md:pl-8 lg:pl-6 3xl:pl-10">
                            <p className="text-sm  font-bold text-navy-700 dark:text-white">
                              {moment(cell.value).format("DD/MM/YYYY")}{" "}
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
          <div className="h-[200px] md:h-[250px] lg:h-[280px] flex justify-center items-center">
            <span className="text-gray-500 text-lg font-bold">No Data Found</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Regularization;
