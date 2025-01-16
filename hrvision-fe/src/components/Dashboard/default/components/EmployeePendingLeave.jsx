import React, { useEffect, useState } from "react";
import SelectButton from "components/button/SelectButton";
import Card from "components/card";
import Cookies from "js-cookie";
import axios from "axios";
import { columnsLeaveApplyEmpDashboard } from "../variables/columnsData";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import moment from "moment";
import Loader from "components/Loader/Loader";

const EmployeePendingLeave = () => {
  const [tableData, setTableData] = useState([]);
  const columns = columnsLeaveApplyEmpDashboard;
  const [loading, setLoading] = useState(true);
  const authToken = Cookies.get("jwt-token");
  const myHeaders = new Headers();
  myHeaders.append("jwt-token", authToken || "");

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
        setTableData(jsondata?.data);
      } else {
        throw new Error(jsondata.message);
      }
    } catch (error) {
      console.error("Error for Pending Leave:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLeaveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);
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
    <Card extra={"w-full h-[350px] lg:h-[425px] px-6"}>
      <header className="relative pt-4 text-start tracking-wider">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Pending Leave Request
        </div>
      </header>

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
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="min-w-[140px] border-b border-gray-200 pb-[10px] text-center tracking-wider  dark:!border-navy-700 md:pr-14 xl:pr-16"
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
                      if (cell.column.Header === "APPLY DATE") {
                        data = (
                          <div className="flex min-w-[140px] items-center gap-2 pl-6 md:pl-4 lg:pl-0 3xl:pl-4">
                            <SelectButton path={"/leave/pending"} />
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                              {" "}
                              {moment(cell.value).format("DD/MM/YYYY")}{" "}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "LEAVE TYPE") {
                        data = (
                          <div className="max-w-[140px] pl-12 md:pl-14 lg:pl-5 3xl:pl-8">
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                              {cell.value}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "LEAVE DATE") {
                        data = (
                          <div className="min-w-[140px] pl-10 md:pl-8 lg:pl-0 3xl:pl-4">
                            <p className=" text-sm font-bold text-navy-700 dark:text-white">
                              {" "}
                              {moment(cell.value).format("DD/MM/YYYY")}{" "}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "TOTAL DAYS") {
                        data = (
                          <div className="min-w-[140px] pl-16 md:pl-18 lg:pl-8 3xl:pl-12">
                            <p className="text-sm  font-bold text-navy-700 dark:text-white">
                              {cell.value}
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
  );
};

export default EmployeePendingLeave;
