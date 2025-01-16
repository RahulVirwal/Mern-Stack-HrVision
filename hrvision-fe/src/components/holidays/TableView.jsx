import NoDataFound from "components/NoDataFound";
import NoDataImage from "../../assets/img/layout/nodata.jpg";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import View from "../../assets/Icon/view.svg";
import close from "../../assets/Icon/close.svg";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { TableViewHolidayHeader } from "../Dashboard/default/variables/columnsData";
import axios from "axios";
import moment from "moment";
import ShowHolidayPage from "./ShowHolidayPage";
import Loader from "components/Loader/Loader";
const TableView = ({refeshData}) => {
  const [tableData, setTableData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [id,setId]=useState("");
  const columns = TableViewHolidayHeader;
  const authToken = Cookies.get("jwt-token");

  const fetchTableData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}holiday/all`,
        {
          headers: {
            "jwt-token": authToken,
          },
        }
      );
      const jsondata = response?.data;
      if (jsondata.status === "ok") {
        const flatData = Object.values(jsondata.data).flat();
        setTableData(flatData);
      } else {
        throw new Error(jsondata.message);
      }
    } catch (error) {
      console.error("Error fetching Holidays:", error);
    } finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchTableData();
    if(refeshData){
      fetchTableData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken,refeshData]);

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

  const handleViewClick = (index) => {
    setId(index);
    setIsOpen(true);
  };
  const closePage = () => {
    setIsOpen(false);
  };
  return (
    <div className="h-[65vh] overflow-y-hidden">
      <div className="mt-2 overflow-y-hidden overflow-x-scroll lg:overflow-hidden">

        {loading ? (
          <div className="h-[50vh]">
          <Loader/>
        </div>
        ) : data.length > 0 && tableData ? (
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
                      let data;
                      if (cell.column.Header === "DATE") {
                        data = (
                          <div className="text-sm font-bold text-gray-700">
                            {moment(cell.value).format("DD/MM/YYYY") ?? "-"}
                          </div>
                        );
                      } else if (cell.column.Header === "TITLE") {
                        data = (
                          <div className="capitalize text-sm font-bold text-gray-700">
                            {cell.value ?? "-"}
                          </div>
                        );
                      } else if (cell.column.Header === "ACTIONS") {
                        data = (
                          <div className="flex justify-center">
                            <span className=" cursor-pointer ">
                              <button
                                onClick={() => handleViewClick(row.original)}
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
        )}
        {isOpen && (
          <div className="bg-black fixed inset-0 z-50 flex items-center justify-center overflow-auto backdrop-blur-sm">
            <div className="relative mx-auto max-w-lg rounded-lg border-2 border-gray-300 bg-white p-4 shadow-lg">
              <button
                className="absolute top-1 right-2 text-gray-600 hover:text-gray-900"
                onClick={closePage}
              >
                <img src={close} alt="" className="h-6 w-6" />
              </button>
              <ShowHolidayPage
                data={id}
                holidayData={fetchTableData}
                onClose={closePage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableView;
