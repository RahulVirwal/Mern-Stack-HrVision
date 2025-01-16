import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Button from "components/button/Button";
import ProfilePage from "./Profilepage";
import Showleave from "./showleave";
import ShowAttendance from "./showattendance";

const Profile = () => {
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState("profilepage");
  const [activeComponent, setActiveComponent] = useState(false);
  const userid = location.pathname
    .split("profilepage")
    .slice(1, 2)[0]
    .slice(1)
    .split("/")
    .slice(0, 1)[0];
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === `/profilepage:${userid}/*`) {
      setActiveComponent(true);
    } else {
      setActiveComponent(false);
    }
  }, [location.pathname, userid]);
  return (
    <div className="h-full w-full">
      <div className="mt-2 grid grid-cols-2 items-center justify-center sm:flex">
        <Button
          className={`${activeRoute === "profilepage" ? "bg-gray-500" : ""}`}
          _onClick={() => {
            handleClick(`profilepage`);
            setActiveRoute("profilepage");
          }}
        >
          <div>Profile</div>
        </Button>
        <Button
          className={`${activeRoute === "empleave" ? "bg-gray-500" : ""}`}
          _onClick={() => {
            handleClick(`empleave`);
            setActiveRoute("empleave");
          }}
        >
          <div>Leave</div>
        </Button>
        <Button
          className={`${activeRoute === "empattendance" ? "bg-gray-500" : ""}`}
          _onClick={() => {
            handleClick(`empattendance`);
            setActiveRoute("empattendance");
          }}
        >
          <div>Attendance</div>
        </Button>
      </div>
      {activeComponent && <ProfilePage />}
      {!activeComponent && (
        <Routes>
          <Route path="profilepage" element={<ProfilePage />} />
           <Route path="empleave" element={<Showleave />} />
          <Route path="empattendance" element={<ShowAttendance />} />
        </Routes>
      )}
    </div>
  );
};

export default Profile;
