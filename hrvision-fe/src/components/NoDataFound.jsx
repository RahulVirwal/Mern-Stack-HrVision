import React from "react";
import NoDataImage from '../assets/img/layout/nodata.jpg'
const NoDataFound = (props) => {
  const img = props.img;
  const extra = props.extra;
  const imgData=props.imgData;
  return (
    <div className={`flex h-full items-center justify-center ${extra}`}>
      <div className="h-full w-full lg:w-10/12">
        <div className="flex h-full items-center justify-center rounded-2xl  p-4 ">
          <div className="flex flex-col items-center">
            <div className=" h-fit w-fit ">
              <img src={img?img:NoDataImage} alt="No-Data" className={`${imgData} grayscale opacity-60`} />
            </div>
            <div className="text-center text-gray-600">No Data Found</div>
          </div>
          <div className="mt-4">
            <ul className="list-none">
              {/* Pending leave requests will be rendered here */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoDataFound;
