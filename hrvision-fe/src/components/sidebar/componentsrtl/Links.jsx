/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";


export function SidebarLinks(props) {
  let location = useLocation();
  const { routes } = props;
  const activeRoute = (routeName) => {
    if (location.pathname===(`/${routeName}`)) {
      return true;
    }
  };


  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (
        route.layout === "/admin" ||
        route.layout === "/employee" ||
        route.layout === "/auth" ||
        route.layout === "/hr" ||
        route.layout === "/rtl"
      ){
        return (
          <Link key={index} to={"/" + route.pathname}>
            <div className="relative mb-3 flex hover:cursor-pointer">
              <li
                className="my-[3px] flex cursor-pointer items-center px-8"
                key={index}
              >
                <span
                  className={`${
                    activeRoute(route.pathname) === true
                      ? "font-bold text-brand-500 dark:text-white"
                      : "font-medium text-gray-600"
                  }`}
                >
                  {route.icon ? route.icon : <DashIcon />}{" "}
                </span>
                <p
                  className={`leading-1 flex ms-4 ${
                    activeRoute(route.pathname) === true
                      ? "font-bold text-navy-700 dark:text-white"
                      : "font-medium text-gray-600"
                  }`}
                >
                  {route.name}
                </p>
              </li>
              {activeRoute(route.pathname) ? (
                <div className="absolute top-px h-9 w-1 rounded-lg bg-brand-500 end-0 dark:bg-brand-400" />
              ) : null}
            </div>
          </Link>
        );
      }
    });
  };
  return createLinks(routes);
}

export default SidebarLinks;
