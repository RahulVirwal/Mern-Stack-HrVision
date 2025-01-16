import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AdminLayout from "layouts/admin";
import EmployeeLayout from "layouts/employee";
import HrLayout from "layouts/hr";
import AuthLayout from "layouts/auth";
import Cookies from "js-cookie";
import PageNotFound from "./404Page";
import Loader from "components/Loader/Loader";

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const authToken = Cookies.get("jwt-token");

  const getUser = useCallback(async () => {
    if (!authToken) return null;

    const myHeaders = new Headers();
    myHeaders.append("jwt-token", authToken);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}user`,
        {
          method: "GET",
          headers: myHeaders,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      return jsonData?.data?.role;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }, [authToken]);

  useEffect(() => {
    const fetchData = async () => {
      const userRole = await getUser();
      setLoading(false);

      if (!authToken && location.pathname !== "/auth/login") {
        navigate("/auth/login");
      } else if (userRole && userRole !== Cookies.get("type")) {
        Cookies.remove("jwt-token");
        navigate("/auth/login");
      }
    };

    fetchData();
  }, [authToken, getUser, location.pathname, navigate]);

  const role = useMemo(() => Cookies.get("type"), []);
  const path = useMemo(() => role?.toLowerCase(), [role]);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        {path === "admin" && <Route path="/*" element={<AdminLayout />} />}
        {path === "employee" && (
          <Route path="/*" element={<EmployeeLayout />} />
        )}
        {path === "hr" && <Route path="/*" element={<HrLayout />} />}
        <Route
          path="/"
          element={<Navigate to={role ? `/default` : "/auth/login"} replace />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
