import React, { useEffect, useState } from "react";
import { columnsDataOfHistoryLeave } from "../../Dashboard/default/variables/columnsData";
import Cookies from "js-cookie";
import axios from "axios";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import NoDataFound from "components/NoDataFound";
import NoDataImage from "../../../assets/img/layout/nodata.jpg";
import Loader from "components/Loader/Loader";

const LeaveHistory = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const columns = columnsDataOfHistoryLeave;
  const authToken = Cookies.get("jwt-token");
  const myHeaders = new Headers();
  myHeaders.append("jwt-token", authToken || "");

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}leave/history`, {
          headers: {
            "jwt-token": authToken,
          },
        });
        const jsondata = response?.data;
        if (jsondata.status === "ok") {
          setLeaveData(jsondata?.data);
        } else {
          throw new Error(jsondata.message);
        }
      } catch (error) {
        console.error("Error for Leaves:", error);
      } finally {
        setLoading(false); 
      }
    };
    fetchLeaveData();
  }, [authToken]);
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
    <div className="h-fit overflow-y-hidden ">
      <div className="mt-8 overflow-x-scroll overflow-y-hidden lg:overflow-hidden">
        {loading ? (
          <div className="h-[60vh]">
          <Loader/>
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
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={index}
                          className="p-4 text-center"
                        >
                          <div className="text-sm font-bold text-gray-700 capitalize">
                            {cell.render("Cell")}
                          </div>
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

export default LeaveHistory;
