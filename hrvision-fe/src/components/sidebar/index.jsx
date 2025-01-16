import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import {
  sidebarRoutesAdmin,
  sidebarRoutesHR,
  sidebarRoutesEmployee,
  sidebarRoutesProjectManager
} from "routes.js";
import Logo from "../../assets/svg/logo.svg";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const Sidebar = ({ open, onClose }) => {
  const [routesData, setRoutesData] = useState();

  useEffect(() => {
    const role = Cookies.get("type");
    if (role === "Admin") {
      setRoutesData(sidebarRoutesAdmin);
    } else if (role === "HR") {
      setRoutesData(sidebarRoutesHR);
    } else if (role === "Employee") {
      const ProjectManager = Cookies.get("projectManager");
      ProjectManager==="true" ? setRoutesData(sidebarRoutesProjectManager) : setRoutesData(sidebarRoutesEmployee);
    }
  }, []);
  // Render nothing if routesData is not yet set
  if (!routesData) {
    return null;
  }

  return (
   <div onClick={onClose}>
     <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}   onClick={(e)=>e.stopPropagation()}  >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        <div className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          <img src={Logo} alt="Logo" className="w-44" />{" "}
          <span className="font-medium"></span>
        </div>
      </div>
      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routesData} />
      </ul>

      {/* Free Horizon Card */}
      <div className="flex justify-center">
        <SidebarCard />
      </div>

      {/* Nav item end */}
    </div>
   </div>
  );
};

export default Sidebar;
