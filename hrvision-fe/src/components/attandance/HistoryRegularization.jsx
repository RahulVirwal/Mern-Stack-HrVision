import React, { useEffect, useState } from "react";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { HistoryRegularizationHeader } from "../Dashboard/default/variables/columnsData";
import Cookies from "js-cookie";
import axios from "axios";
import NoDataFound from "components/NoDataFound";
import NoDataImage from "../../assets/img/layout/nodata.jpg";
import Loader from "components/Loader/Loader";

const HistoryRegularization = () => {
  const columns = HistoryRegularizationHeader;
  const [regularizationData, setRegularizationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const authToken = Cookies.get("jwt-token");
  const myHeaders = new Headers();
  myHeaders.append("jwt-token", authToken || "");

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}forgetattendance/history`,
          {
            headers: {
              "jwt-token": authToken,
            },
          }
        );
        const jsondata = response?.data;
        if (jsondata.status === "ok") {
          setRegularizationData(jsondata?.data);
        } else {
          throw new Error(jsondata.message);
        }
      } catch (error) {
        console.error("Error for Regularization:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveData();
  }, [authToken]);

  const data = regularizationData;
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

  const truncateText = (text, length = 20) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };
  return (
    <div className="h-[75vh] overflow-y-hidden">
      <div className="mt-8 overflow-x-scroll overflow-y-hidden lg:overflow-hidden">
        {loading ? (
          <div className="h-[60vh]">
            <Loader />
          </div>
        ) : data.length > 0 ? (
          <table
            {...getTableProps()}
            className="w-full min-w-[900px] bg-white shadow-md table-auto"
          >
            <thead className="bg-gray-300">
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="border-b border-gray-300 p-4 text-center text-xs font-bold uppercase tracking-wider"
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
                      const isReasonColumn = cell.column.id === "reason";
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={index}
                          className="p-4 text-center"
                        >
                          {isReasonColumn ? (
                            <div className="group relative">
                              <div className="cursor-pointer text-sm font-bold text-gray-700 capitalize">
                                {truncateText(cell.value)}
                              </div>
                              <div className="absolute bottom-full left-1/2 mb-2  w-64 cursor-pointer rounded bg-gray-800 p-2 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 capitalize">
                                {cell.value}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm font-bold text-gray-700 capitalize">
                              {cell.render("Cell")}
                            </div>
                          )}
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
        )}
      </div>
    </div>
  );
};

export default HistoryRegularization;
