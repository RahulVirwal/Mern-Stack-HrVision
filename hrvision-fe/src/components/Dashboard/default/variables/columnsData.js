import moment from "moment";


export const columnsDataDevelopment = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "TECH",
    accessor: "tech",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
];

export const columnsDataCheck = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
  {
    Header: "QUANTITY",
    accessor: "quantity",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
];
export const columnsLeaveApplyDashboard = [
  {
    Header: "NAME",
    accessor: "userName",
  },
  {
    Header: "LEAVE TYPE",
    accessor: "leaveType",
  },
  {
    Header: "TOTAL DAYS",
    accessor: "leaveDays",
  },
  {
    Header: "LEAVE DATE",
    accessor: "fromDate",
  },
];
export const columnsLeaveApplyEmpDashboard = [
  {
    Header: "APPLY DATE",
    accessor: "createdAt",
  },
  {
    Header: "LEAVE TYPE",
    accessor: "leaveType",
  },
  {
    Header: "TOTAL DAYS",
    accessor: "leaveDays",
  },
  {
    Header: "LEAVE DATE",
    accessor: "fromDate",
  },
];
export const columnsRegularizationDashboard = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "APPLICATION DATE",
    accessor: "createdAt",
  },
  {
    Header: "APPLY DATE",
    accessor: "date",
  },
  {
    Header: "SESSION",
    accessor: "session",
  },
];
export const columnsLeaveCheck = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "POSITION",
    accessor: "position",
  },
  {
    Header: "TOTAL DAYS",
    accessor: "progress",
  },
  {
    Header: "LEAVE DATE",
    accessor: "date",
  },
];
export const employeeColumns = [
  {
    Header: "ID",
    accessor: "employeeId",
  },
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "POSITION",
    accessor: "position",
  },
  {
    Header: "DATE",
    accessor: "joining_date",
  },
  {
    Header: "EMAIL",
    accessor: "email",
  },
  {
    Header: "ACTIONS",
    accessor: "_id",
  },
];

export const columnsDataColumns = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
  {
    Header: "QUANTITY",
    accessor: "quantity",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
];

export const columnsDataComplex = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "STATUS",
    accessor: "status",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
];
export const columnsDataApplyLeave = [
  {
    Header: "APPLICATION DATE",
    accessor: "applicationdate",
  },
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "LEAVE TYPE",
    accessor: "leavetype",
  },
  {
    Header: "LEAVE DATE",
    accessor: "leavedate",
  },
  {
    Header: "RETURN DATE",
    accessor: "returndate",
  },
  {
    Header: "TOTAL DAYS",
    accessor: "days",
  },
  {
    Header: "ACTIONS",
    accessor: "actions",
  },
];

export const columnsDataOfPendingLeave = [
  {
    Header: "APPLICATION DATE",
    accessor: "createdAt",
    Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
  },
  {
    Header: "LEAVE TYPE",
    accessor: "leaveType",
  },
  {
    Header: "LEAVE DATE",
    accessor: "fromDate",
    Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
  },
  {
    Header: "RETURN DATE",
    accessor: "toDate",
    Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
  },
  {
    Header: "TOTAL DAYS",
    accessor: "leaveDays",
  },
  {
    Header: "ACTIONS",
    accessor: "_id",
  },
];
export const columnDataForApproveLeave = [
  {
    Header: "APPLICATION DATE",
    accessor: "createDate",
  },
  {
    Header: "NAME",
    accessor: "userName",
  },
  {
    Header: "LEAVE TYPE",
    accessor: "leaveType",
  },
  {
    Header: "LEAVE DATE",
    accessor: "fromDate",
  },
  {
    Header: "RETURN DATE",
    accessor: "toDate",
  },
  {
    Header: "TOTAL DAYS",
    accessor: "leaveDays",
  },
  {
    Header: "ACTIONS",
    accessor: "actions",
  },
];
export const columnsDataOfHistoryLeave = [
  {
    Header: "APPLICATION DATE",
    accessor: "createdAt",
    Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
  },
  {
    Header: "NAME",
    accessor: "userName",
  },
  {
    Header: "LEAVE TYPE",
    accessor: "leaveType",
  },
  {
    Header: "LEAVE DATE",
    accessor: "fromDate",
    Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
  },
  {
    Header: "RETURN DATE",
    accessor: "toDate",
    Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
  },
  {
    Header: "TOTAL DAYS",
    accessor: "leaveDays",
  },
  {
    Header: "Approved By",
    accessor: "approvedBy",
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => {
      const statusClass =
        value === "approved"
          ? "text-green-500"
          : value === "rejected"
          ? "text-red-500"
          : "";
      return <span className={`font-bold ${statusClass}`}>{value}</span>;
    },
  },
];

export const PendingRegularizationHeader = [
  {
    Header: "APPLICATION DATE",
    accessor: "createdAt",
    Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
  },
  {
    Header: "DATE",
    accessor: "date",
    Cell: ({ value }) => moment(value).format("DD/MM/YYYY"), 
  },
  {
    Header:"SESSION",
    accessor:"session",
  },
  {
    Header: "REASON",
    accessor: "reason",
  },
];
export const HistoryRegularizationHeader = [
  {
    Header: "APPLICATION DATE",
    accessor: "createdAt",
    Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
  },
  {
    Header:"NAME",
    accessor:"userName",
  },
  {
    Header: "REGULARIZATION DATE",
    accessor: "date",
    Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
  },
  
  {
    Header:"SESSION",
    accessor:"session",
  },
  {
    Header: "REASON",
    accessor: "reason",
  },
  {
    Header: "Approved By",
    accessor: "approvedBy",
  },
  {
    Header: "STATUS",
    accessor: "status",
    Cell: ({ value }) => {
      const statusClass =
        value === "approved"
          ? "text-green-500"
          : value === "rejected"
          ? "text-red-500"
          : "";
      return <span className={`font-bold ${statusClass}`}>{value}</span>;
    },
  },
];

export const MyRegularizationHeader = [
  {
    Header: "NAME",
    accessor: "userName",
  },
  {
    Header: "REGULARIZATION DATE",
    accessor: "date",
  },
  {
    Header:"SESSION",
    accessor:"session",
  },
  {
    Header: "REASON",
    accessor: "reason",
  },
  {
    Header: "ACTIONS",
    accessor: "actions",
  },
];
export const TableViewHolidayHeader = [
  {
    Header: "DATE",
    accessor: "date",
  },
  {
    Header: "TITLE",
    accessor: "name",
  },
  {
    Header:"ACTIONS",
    accessor:"_id",
  },
];
