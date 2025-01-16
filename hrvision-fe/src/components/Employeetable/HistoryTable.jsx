import React, { useEffect, useState } from "react";
import View from "../../assets/Icon/view.svg";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import EmployeeCard from "components/employeeCard";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import Loader from "components/Loader/Loader";
import NoDataFound from "components/NoDataFound";
import { employeeColumns } from "components/Dashboard/default/variables/columnsData";
import NoDataImage from "../../assets/img/layout/nodata.jpg";
import Cookies from "js-cookie";
import axios from "axios";

const HistoryTable = (props) => {
  const [employeeData, setEmployeeData] = useState([]);
  const columns = employeeColumns;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authToken = Cookies.get("jwt-token");
  const location = useLocation();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}user/disable`,
          {
            headers: {
              "jwt-token": authToken || "",
            },
          }
        );

        if (response.data.status === "ok") {
          setEmployeeData(response.data?.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [location.pathname, authToken]);
  const data = employeeData;
  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    tableInstance;

  const handleViewClick = (id) => {
    navigate(`profilepage:${id}/profilepage`);
  };

  return (
    <div className="h-fit overflow-hidden">
      <EmployeeCard extra={" mt-4 "}>
        <div className="mt-8 overflow-y-hidden overflow-x-scroll lg:overflow-hidden">
          {loading ? (
            <div className="h-[60vh]">
              <Loader />
            </div>
          ) : employeeData.length > 0 ? (
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
                        className=" border-b border-gray-300  p-4 text-center text-xs font-bold uppercase tracking-wider"
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
                        if (cell.column.Header === "NAME") {
                          data = (
                            <div className="flex justify-center">
                              <p className="capitalize text-sm font-bold text-gray-700">
                                {cell.value ?? "-"}
                              </p>
                            </div>
                          );
                        } else if (cell.column.Header === "ID") {
                          data = (
                            <div className="flex  justify-center pr-2 ">
                              <p className=" text-sm font-bold text-gray-700">
                                {cell.value ?? "-"}
                              </p>
                            </div>
                          );
                        } else if (cell.column.Header === "POSITION") {
                          data = (
                            <div className="flex  justify-center">
                              <p className="capitalize text-sm font-bold text-gray-700">
                                {" "}
                                {cell.value ?? "-"}{" "}
                              </p>
                            </div>
                          );
                        } else if (cell.column.Header === "DATE") {
                          data = (
                            <div className="flex  justify-center">
                              <p className="text-sm font-bold text-gray-700">
                                {moment(cell.value).format("DD/MM/YYYY") ?? "-"}
                              </p>
                            </div>
                          );
                        } else if (cell.column.Header === "EMAIL") {
                          data = (
                            <div className="flex  justify-center">
                              <p className="text-sm font-bold text-gray-700">
                                {cell.value ?? "-"}
                              </p>
                            </div>
                          );
                        } else if (cell.column.Header === "ACTIONS") {
                          data = (
                            <div className="flex justify-center">
                              <span className="cursor-pointer ">
                                <button
                                  onClick={() =>
                                    handleViewClick(row.original._id)
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
            <NoDataFound img={NoDataImage} />
          )}
        </div>
      </EmployeeCard>
    </div>
  );
};

export default HistoryTable;
