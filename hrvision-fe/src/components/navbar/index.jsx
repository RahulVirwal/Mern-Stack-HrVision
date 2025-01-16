import React, { useEffect, useState } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import Person from "../../assets/img/avatars/Person.jpg";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Navbar = (props) => {
  const { onOpenSidenav, brandText, path } = props;
  const [user, setUser] = useState();
  const authToken = Cookies.get("jwt-token");
  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("jwt-token", authToken || "");
    fetch(`${process.env.REACT_APP_BASE_API_URL}user`, {
      method: "GET",
      headers: myHeaders,
    })
      .then((response) => response.json())
      .then((jsondata) => setUser(jsondata?.data?.name.toUpperCase()));
  }, [authToken]);
  const handleClick = () => {
    Cookies.remove("jwt-token");
    toast.success("You are successfully signed out", "Success");
  };
  return (
    <nav className=" top-4 z-40  flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2  ">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <span
            className="text-sm font-normal text-navy-700 hover:underline  dark:hover:text-white"
            href="#"
          >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 ">
              {" "}
              /{" "}
            </span>
          </span>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline  dark:hover:text-white"
            to={path.split("/").slice(1, 2)[0]}
          >
            {brandText}
          </Link>
        </div>
        <p className="mt-5 shrink text-lg capitalize text-navy-700 sm:text-2xl md:text-[33px]">
          <Link
            to={path.split("/").slice(1, 2)[0]}
            className="font-bold capitalize hover:text-navy-700 "
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative  mt-5 flex h-[61px] w-[100px] items-center justify-around gap-2 rounded-lg py-2  md:w-[100px] md:flex-grow-0 md:gap-1 xl:w-[100px] xl:gap-2">
        <span
          className="flex cursor-pointer text-xl text-gray-600  xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full hover:cursor-pointer"
              src={Person}
              alt="Elon Musk"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-lg  bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 ">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-md font-bold text-navy-700 ">
                    👋 HEY, {user}
                  </p>{" "}
                </div>
              </div>

              <div className="flex justify-end px-4 py-2">
                <Link
                  to="/"
                  onClick={handleClick}
                  className=" rounded-md bg-red-500 p-2 text-sm font-medium text-white transition duration-150 ease-out hover:bg-red-400 hover:ease-in"
                >
                  Log Out
                </Link>
              </div>
            </div>
          }
          classNames={" py-2  top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
