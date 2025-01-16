import React from "react";
import Card from "components/card";
import LeavePending from "components/leave/leaveApply/LeavePending";

const EmpLeave = () => {
  return (
    <>
      <Card extra={"w-full h-[350px] lg:h-[425px] px-6"}>
      <div>
      <header className="relative text-start pt-4 tracking-wider">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
         Pending Leave Request
        </div>
      </header>
      </div>
        <LeavePending />
      </Card>
    </>
  );
};

export default EmpLeave;
