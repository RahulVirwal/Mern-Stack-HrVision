import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import { sidebarRoutesAdmin } from "routes.js";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState("Main Dashboard");

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getActiveRoute(sidebarRoutesAdmin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        open &&
        e.target.closest(".sidebar") === null &&
        window.innerWidth < 1200
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf("/" + routes[i].pathname) !== -1) {
        setCurrentRoute(routes[i].name);
        activeRoute = routes[i].name;
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        activeNavbar = routes[i].secondary || false;
        break;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-3 h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              path={location.pathname}
              onOpenSidenav={(e) => {
                setOpen(true);
                e.stopPropagation();
              }}
              logoText={""}
              brandText={currentRoute}
              secondary={getActiveNavbar(sidebarRoutesAdmin)}
              {...rest}
            />
            <div className="mx-auto mb-auto h-full min-h-[84vh] p-2 pt-5 md:pr-2">
              <Routes>
                {getRoutes(sidebarRoutesAdmin)}
                <Route path="/" element={<Navigate to="/default" replace />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
