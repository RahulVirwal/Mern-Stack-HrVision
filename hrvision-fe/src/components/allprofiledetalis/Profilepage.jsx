import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({});
  const [projectManagers, setProjectManagers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  // const [password, setPassword] = useState(null);
  // const [rePassword, setRePassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [passwordField, setPasswordField] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [contactError, setContactError] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const location = useLocation();
  const role = Cookies.get("type");
  const authToken = Cookies.get("jwt-token");
  const userid = location.pathname
    .split("profilepage")
    .slice(1, 2)[0]
    .slice(1)
    .split("/")
    .slice(0, 1)[0];

  const employeeOptions = [
    { value: "Employee", label: "Employee" },
    { value: "HR", label: "HR" },
  ];
  const isProjectManagerOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  const positionOptions = [
    { value: "Full Stack Developer", label: "Full Stack Developer" },
    { value: "Front End Web Developer", label: "Front End Web Developer" },
    { value: "Front End App Developer", label: "Front End App Developer" },
    { value: "Back End Developer", label: "Back End Developer" },
    { value: "BDE", label: "BDE" },
    { value: "HR", label: "HR" },
    { value: "UI/UX", label: "UI/UX" },
  ];

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const filteredValue =
      name === "password" || name === "repassword"
        ? value.replace(/\s/g, "")
        : value;

    setProfile({ ...profile, [name]: filteredValue });
    setIsDirty(true);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setPasswordField(false);
  };
  const fetchEmployeeDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}user`,
        {
          params: {
            employeeId: userid,
          },
          headers: { "jwt-token": authToken || "" },
        }
      );

      if (response.data.status === "ok") {
        setProfile(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  }, [authToken, userid]);

  const getUser = useCallback(async () => {
    const myHeaders = new Headers();
    myHeaders.append("jwt-token", authToken || "");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}user/pm`,
        {
          method: "GET",
          headers: myHeaders,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      return jsonData?.data.map((manager) => ({
        label: manager.name,
        value: manager._id,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
      return [];
    }
  }, [authToken]);

  useEffect(() => {
    const fetchProjectManagers = async () => {
      const managers = await getUser();
      setProjectManagers(managers);
    };
    fetchProjectManagers();
    fetchEmployeeDetails();
  }, [fetchEmployeeDetails, getUser]);

  const handleSave = async () => {
    const updatedProfile = { ...profile, id: profile._id };
    delete updatedProfile._id;
    setEmailError(false);
    setContactError(false);
    setPasswordField(false);
    setIsDirty(false);
    if (!validateEmail(profile.email) || profile.contact.length < 10) {
      setEmailError(!validateEmail(profile.email));
      setContactError(profile.contact.length < 10);
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API_URL}user`,
        updatedProfile,
        {
          headers: { "jwt-token": authToken || "" },
        }
      );

      if (response.data.status === "ok") {
        toast.success("Updated Successfully", "Success");
        setEmailError(false);
        setContactError(false);
        fetchEmployeeDetails();
      } else {
        fetchEmployeeDetails();
        setEmailError(false);
        setContactError(false);
        throw new Error(response.message);
      }
    } catch (error) {
      console.log("Error fetching employee details:", error);
      toast.error(error.response.data.message, "Error");
      fetchEmployeeDetails();
    }
    setIsEditing(false);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };
  const handleDelete = async () => {
    const authToken = Cookies.get("jwt-token");
    if (!authToken) {
      toast.error("Auth token is missing", "ERROR");
      return;
    }
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_API_URL}user?employeeId=${profile._id}`,
        {
          headers: {
            "jwt-token": authToken,
          },
        }
      );
      if (response?.data?.status === "ok") {
        toast.success(response.data.message, "SUCCESS");
        navigate("/employee-detail");
      } else {
        throw new Error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message, "ERROR");
    }
  };

  const isFormValid = () => {
    return (
      profile.name.trim() !== "" &&
      profile.email.trim() !== "" &&
      profile.contact.length !== 0 &&
      profile.sickLeave.length !== 0 &&
      profile.paidLeave.length !== 0 &&
      profile.compOffLeave.length !== 0 &&
      profile.address.trim() !== ""
    );
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  return (
    <div className="mt-4 flex h-full items-center justify-center">
      <div
        className={`w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg ${
          isEditing ? "h-full" : " "
        } sm:[h-full]`}
      >
        <div className="flex flex-col space-y-6">
          {isEditing ? (
            <>
              {role === "Admin" && (
                <div className="flex flex-col space-y-4">
                  <div className="">
                    <label className="block text-sm font-semibold text-gray-700">
                      Unique ID
                    </label>
                    <input
                      type="text"
                      name="uniqueId"
                      value={profile.uniqueId}
                      onChange={handleInputChange}
                      className="form-control  mt-1 block w-full rounded-md border-gray-300 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 "
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="form-control  mt-1 block w-full rounded-md border-gray-300 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {emailError && (
                    <p className="text-sm text-red-500">
                      Invalid email address
                    </p>
                  )}
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={profile.contact}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  {contactError && (
                    <p className="text-sm text-red-500">
                      Contact number must be at least 10 digits
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="flex w-full flex-col md:w-1/2">
                  <label className=" text-sm font-semibold text-gray-700">
                    Date of Birth
                  </label>
                  <DatePicker
                    selected={profile?.dob ? new Date(profile?.dob) : maxDate}
                    maxDate={maxDate}
                    onChange={(date) =>
                      setProfile({
                        ...profile,
                        dob: date,
                      })
                    }
                    dateFormat="dd/MM/yyyy"
                    className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex w-full flex-col md:w-1/2">
                  <label className=" text-sm font-semibold text-gray-700">
                    Joining Date
                  </label>
                  <DatePicker
                    selected={new Date(profile.joining_date)}
                    value={new Date(profile.joining_date)}
                    onChange={(date) =>
                      setProfile(
                        { ...profile, joining_date: date },
                        setIsDirty(true)
                      )
                    }
                    dateFormat="dd/MM/yyyy"
                    className="form-control mt-1 w-full rounded-md border-gray-300 py-2  pl-3 text-base shadow focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className=" text-sm font-semibold text-gray-700">
                    Management Role
                  </label>
                  <Select
                    options={employeeOptions}
                    value={employeeOptions.find(
                      (option) => option.value === profile.role
                    )}
                    onChange={(selectedOption) =>
                      setProfile(
                        { ...profile, role: selectedOption },
                        setIsDirty(true)
                      )
                    }
                    className="date-width mt-1 block w-full rounded-md bg-gray-100 text-base focus:border-indigo-500 focus:outline-none "
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className=" text-sm font-semibold text-gray-700">
                    Employee Position
                  </label>
                  <Select
                    maxMenuHeight={200}
                    options={positionOptions}
                    value={positionOptions.find(
                      (option) => option.value === profile.position
                    )}
                    onChange={(selectedOption) =>
                      setProfile(
                        { ...profile, position: selectedOption.value },
                        setIsDirty(true)
                      )
                    }
                    className="date-width mt-1 block w-full rounded-md bg-gray-100 text-base focus:border-indigo-500 focus:outline-none "
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className=" text-sm font-semibold text-gray-700">
                    Is Project Manager
                  </label>
                  <Select
                    options={isProjectManagerOptions}
                    value={isProjectManagerOptions.find(
                      (option) => option.value === `${profile.projectManager}`
                    )}
                    onChange={(selectedOption) =>
                      setProfile(
                        {
                          ...profile,
                          projectManager:
                            selectedOption.value === "true" ? true : false,
                        },
                        setIsDirty(true)
                      )
                    }
                    className="date-width mt-1 block w-full rounded-md bg-gray-100 text-base focus:border-indigo-500 focus:outline-none "
                  />
                </div>
                {profile.projectManager === false && (
                  <div className="w-full md:w-1/2">
                    <label className=" text-sm font-semibold text-gray-700">
                      Project Manager Name
                    </label>
                    <Select
                      maxMenuHeight={200}
                      options={projectManagers}
                      value={
                        profile.projectManager === true
                          ? ""
                          : projectManagers.find(
                              (option) =>
                                option.value === profile.projectManagerId
                            )
                      }
                      placeholder={"Project Manager"}
                      onChange={(selectedOption) => {
                        setProfile(
                          {
                            ...profile,
                            projectManagerId: selectedOption.value,
                          },
                          setIsDirty(true)
                        );
                      }}
                      disabled={profile.projectManager === true}
                      className="date-width mt-1 block w-full rounded-md bg-gray-100 text-base focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sick Leave
                  </label>
                  <input
                    type="number"
                    name="sickLeave"
                    min="0"
                    value={profile.sickLeave}
                    onChange={handleInputChange}
                    className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Paid Leave
                  </label>
                  <input
                    type="number"
                    name="paidLeave"
                    value={profile.paidLeave}
                    onChange={handleInputChange}
                    min="0"
                    className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Comp Off Leave
                  </label>
                  <input
                    type="number"
                    name="compOffLeave"
                    min="0"
                    value={profile.compOffLeave}
                    onChange={handleInputChange}
                    className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>
              {role === "Admin" && (
                <div className="flex justify-start">
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="radio"
                      name="tab"
                      value="passwordField"
                      checked={passwordField === true}
                      onChange={() => setPasswordField(true)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Forget Password
                    </span>
                  </label>
                </div>
              )}
              {role === "Admin" && passwordField && (
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                  <div className="relative flex w-full items-center md:w-1/2">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      onKeyDown={handleKeyDown}
                      onChange={handleInputChange}
                      className="form-control w-full rounded-lg border px-4 py-2 pr-10"
                      placeholder="Password"
                    />
                    <span
                      className="absolute inset-y-0 right-3 flex cursor-pointer items-center pl-3"
                      onClick={togglePasswordVisibility}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                  <div className="relative w-full md:w-1/2">
                    <input
                      name="repassword"
                      type={showRePassword ? "text" : "password"}
                      onKeyDown={handleKeyDown}
                      onChange={handleInputChange}
                      className="form-control w-full rounded-lg border px-4 py-2 pr-10"
                      placeholder="Confirm Password"
                      required
                    />
                    <span
                      className="absolute inset-y-0 right-3 flex cursor-pointer items-center pl-3"
                      onClick={toggleRePasswordVisibility}
                    >
                      <FontAwesomeIcon
                        icon={showRePassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <h2 className="text-3xl font-semibold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-lg lg:text-xl">{profile.position}</p>
              </div>
              {role === "Admin" && (
                <div className="flex flex-col space-y-4">
                  <div className="">
                    <h4 className="px-2 text-lg font-semibold text-gray-800">
                      Unique ID
                    </h4>
                    <input
                      value={profile.uniqueId}
                      disabled
                      className="w-full bg-gray-100 px-2 py-1"
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <h4 className="px-2 text-lg font-semibold text-gray-800">
                    Email
                  </h4>
                  <input
                    value={profile.email}
                    disabled
                    className="w-full bg-gray-100 px-2 py-1"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <h4 className="px-2 text-lg font-semibold text-gray-800">
                    Phone
                  </h4>
                  <input
                    value={profile.contact}
                    disabled
                    className="w-full bg-gray-100 px-2 py-1"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <div>
                  <h4 className="px-2 text-lg font-semibold text-gray-800">
                    Address
                  </h4>
                  <input
                    value={profile.address}
                    disabled
                    className="w-full bg-gray-100 px-2 py-1"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <h4 className="px-2 text-lg font-semibold text-gray-800">
                    Date of Birth
                  </h4>
                  <input
                    disabled
                    value={moment(profile.dob).format("DD/MM/YYYY")}
                    className="w-full bg-gray-100 px-2 py-1"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <h4 className="px-2 text-lg font-semibold text-gray-800">
                    Joining Date
                  </h4>
                  <input
                    disabled
                    value={moment(profile.joining_date).format("DD/MM/YYYY")}
                    className="w-full bg-gray-100 px-2 py-1"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="w-full">
                  <h4 className="px-2 text-lg font-semibold text-gray-800">
                    Management Role
                  </h4>
                  <input
                    value={profile.role}
                    disabled
                    className="w-full bg-gray-100 px-2 py-1"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className=" px-2 text-lg font-semibold text-gray-800">
                    Is Project Manager
                  </label>
                  <input
                    disabled
                    value={`${profile.projectManager === true ? "Yes" : "No"}`}
                    className="date-width mt-1 block w-full  bg-gray-100 px-2 py-1 text-base focus:border-indigo-500 focus:outline-none "
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className=" px-2 text-lg font-semibold text-gray-800">
                    ProjectManagerID
                  </label>
                  <input
                    disabled
                    value={
                      profile?.projectManagerId
                        ? profile?.projectManagerId
                        : "Not Assigned"
                    }
                    className="date-width mt-1 block w-full  bg-gray-100 px-2 py-1 text-base focus:border-indigo-500 focus:outline-none "
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="w-full md:w-1/3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Sick Leave
                  </h4>
                  <input
                    value={profile.sickLeave}
                    disabled
                    className="w-full bg-gray-100 px-2 py-1"
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Paid Leave
                  </h4>
                  <input
                    value={profile.paidLeave ?? "0"}
                    disabled
                    className="w-full bg-gray-100 px-2 py-1"
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    CompOff Leave
                  </h4>
                  <input
                    value={profile.compOffLeave}
                    disabled
                    className="w-full bg-gray-100 px-2 py-1"
                  />
                </div>
              </div>
              {role === "Admin" && profile?.updateBy && (
                <div>
                  <div className="flex  w-full justify-end">
                    <h6 className="font-semibold text-red-500">
                      *Last Updated By {profile.updateBy}
                    </h6>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className={`rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 ${
                  isFormValid()
                    ? "bg-blue-500 text-white"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                } ${!isDirty ? "bg-gray-400" : "bg-blue-600"}`}
                disabled={!isFormValid() || !isDirty}
              >
                Save
              </button>
              <button
                onClick={() => {
                  handleEditToggle();
                  fetchEmployeeDetails();
                }}
                className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 shadow-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {Cookies.get("employeeStatus") !== "false" && (
                <button
                  onClick={handleEditToggle}
                  className="w-[80px] rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
                >
                  Edit
                </button>
              )}
              {Cookies.get("employeeStatus") !== "false" && (
                <button
                  onClick={handleDelete}
                  className="w-[80px] rounded-md bg-red-600  px-4 py-2 text-white shadow-sm hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
