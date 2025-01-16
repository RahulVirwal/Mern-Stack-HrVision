import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faEye,
  faEyeSlash,
  faPhone,
  faAddressCard,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../logos/logo1.svg";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  // const [passwordMatch, setPasswordMatch] = useState(true);
  const [email, setEmail] = useState("");
  const [sickLeave, setSickLeave] = useState("");
  const [paidLeave, setPaidLeave] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("Full Stack Developer");
  const [joiningDate, setJoiningDate] = useState(new Date());
  const [trainee, setTrainee] = useState("Fresher");
  const [role, setRole] = useState("Employee");
  const [dob, setDob] = useState(new Date());
  const [projectManagers, setProjectManagers] = useState([]);
  const [projectManagerId, setProjectManagerId] = useState();
  const [incorrectPassword, setIncorrectPassword] = useState(true);
  const [incorrectEmail, setIncorrectEmail] = useState(true);
  const [contectlen, setContectLen] = useState(true);
  const authToken = Cookies.get("jwt-token");
  const navigate = useNavigate();

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const data = {
    name: username,
    email: email,
    contact: contact,
    address: address,
    position: position,
    password: password,
    repassword: rePassword,
    role: role,
    joining_date: new Date(joiningDate).toDateString(),
    experience: trainee,
    bod: new Date(dob).toDateString(),
    sickLeave: sickLeave,
    paidLeave: paidLeave,
    projectManagerId: projectManagerId,
  };

  const positionOptions = [
    { value: "Full Stack Developer", label: "Full Stack Developer" },
    { value: "Front End Web Developer", label: "Front End Web Developer" },
    { value: "Front End App Developer", label: "Front End App Developer" },
    { value: "Back End Developer", label: "Back End Developer" },
    { value: "BDE", label: "BDE" },
    { value: "HR", label: "HR" },
    { value: "UI/UX", label: "UI/UX" },
  ];

  const employeeOptions = [
    { value: "Fresher", label: "Trainee" },
    { value: "Experience", label: "Experienced" },
  ];

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!emailValid) {
      setIncorrectEmail(!incorrectEmail);
      return;
    } else if (contact.length < 10) {
      setContectLen(!contectlen);
      return;
    } else if (password !== rePassword) {
      setIncorrectPassword(!incorrectPassword);
      return;
    }

    if (password === rePassword && emailValid && contact.length === 10) {
      const headers = { "jwt-token": authToken || "" };

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_API_URL}auth/signup`,
          data,
          { headers }
        );

        const jsondata = response.data;
        if (jsondata.status === "ok") {
          toast.success(jsondata.message, "SUCCESS");
          setAddress("");
          setContact("");
          setDob(new Date());
          setEmail("");
          setJoiningDate(new Date());
          setPassword("");
          setPosition("");
          setRePassword("");
          setRole("");
          setTrainee("");
          setUsername("");
          setSickLeave("");
          setPaidLeave("");
          navigate("/employee-detail");
        } else {
          toast.error(jsondata.message, "ERROR");
          throw new Error(jsondata.message);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

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
  }, [getUser]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRePasswordVisibility = () => setShowRePassword(!showRePassword);

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
    setEmailValid(validateEmail(email));
  };

  const isFormValid = () => {
    return (
      username.trim() !== "" &&
      email.trim() !== "" &&
      contact.trim() !== "" &&
      address.trim() !== "" &&
      password.trim() !== "" &&
      rePassword.trim() !== "" &&
      sickLeave.trim() !== "" &&
      paidLeave.trim() !== ""
    );
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center">
      <div className="h-full w-full  max-w-[800px] rounded-lg bg-white bg-opacity-50 p-5 shadow-md sm:w-[80%]">
        <div className="col-span-2 flex flex-col items-center justify-center">
          <a href="/">
            <img
              className="m-auto mb-5 mt-2 max-h-[200px] max-w-[200px] md:max-h-[300px] md:max-w-[300px]"
              src={logo}
              alt="logo"
            />
          </a>
          <form
            onSubmit={handleOnSubmit}
            className="flex flex-wrap items-center justify-center"
          >
            <div className="relative mb-3 w-5/6">
              <input
                type="text"
                className="form-control pr-10"
                placeholder="Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <span className="absolute inset-y-0 right-3 flex items-center pl-3">
                <FontAwesomeIcon icon={faUser} />
              </span>
            </div>
            <div className="mb-3 w-5/6">
              <div className="relative flex">
                <input
                  type="email"
                  className={`form-control pr-10 ${emailValid ? "" : "border-red-500"
                    }`}
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <span className="absolute inset-y-0 right-3 flex items-center pl-3">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </div>
              {!incorrectEmail && (
                <p className="mx-2 mt-1 text-red-500">Invalid email address!</p>
              )}
            </div>
            <div className="mb-3 w-5/6">
              <div className="relative flex">
                <input
                  type="number"
                  className="form-control pr-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none "
                  placeholder="Contact"
                  value={contact}
                  onChange={(e) => {
                    if (e.target.value.length > 10) {
                      return;
                    } else {
                      setContact(Number(e.target.value).toString());
                    }
                  }}
                />
                <span className="absolute inset-y-0 right-3 flex items-center pl-3">
                  <FontAwesomeIcon icon={faPhone} />
                </span>
              </div>
              {!contectlen && (
                <p className="mx-2 mt-1 text-red-500">
                  Invalid Contact Details!
                </p>
              )}
            </div>
            <div className="relative mb-3 w-5/6">
              <input
                type="textarea"
                className="form-control pr-10"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <span className="absolute inset-y-0 right-3 flex items-center pl-3">
                <FontAwesomeIcon icon={faAddressCard} />
              </span>
            </div>
            <div className="relative mb-3 w-5/6">
              <Select
                maxMenuHeight={200}
                options={positionOptions}
                value={positionOptions.find(
                  (option) => option.value === position
                )}
                onChange={(selectedOption) => setPosition(selectedOption.value)}
                className="date-width mt-1 block w-full rounded-md bg-gray-100 text-base focus:border-indigo-500 focus:outline-none "
              />
            </div>
            <div className="mb-3 grid w-5/6 grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex flex-col">
                <label
                  htmlFor="joiningDate"
                  className="mx-1  text-sm font-medium text-gray-700 md:text-base"
                >
                  Joining Date
                </label>

                <DatePicker
                  selected={joiningDate}
                  value={joiningDate}
                  onChange={(date) => setJoiningDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control mt-1 w-full rounded-md border-gray-300 py-2  pl-3 text-base shadow focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="dob"
                  className="mx-1  text-sm font-medium text-gray-700 md:text-base"
                >
                  Date of Birth
                </label>
                <DatePicker
                  selected={maxDate > dob ? dob : maxDate}
                  value={maxDate > dob ? dob : maxDate}
                  maxDate={maxDate}
                  onChange={(date) => setDob(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control mt-1 w-full rounded-md border-gray-300 py-2  pl-3 text-base shadow focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mb-3 grid w-5/6 grid-cols-2 gap-2">
              <input
                type="number"
                value={sickLeave}
                onChange={(e) => setSickLeave(e.target.value)}
                className="form-control pr-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="Sick Leave"
              />
              <input
                type="number"
                value={paidLeave}
                onChange={(e) => setPaidLeave(e.target.value)}
                className="form-control pr-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="Paid Leave"
              />
            </div>
            <div className="mb-3 w-5/6">
              <Select
                options={employeeOptions}
                value={employeeOptions.find(
                  (option) => option.value === trainee
                )}
                onChange={(option) => setTrainee(option.value)}
                className=" mt-1 block w-full rounded-md bg-gray-100 text-base focus:border-indigo-500 focus:outline-none "
              />
            </div>
            <div className="mb-3 w-5/6">
              <Select
                placeholder="Select Project Manager"
                options={projectManagers}
                onChange={(selectedOption) =>
                  setProjectManagerId(selectedOption.value)
                }
                className=" mt-1 block w-full rounded-md bg-gray-100 text-base focus:border-indigo-500 focus:outline-none "
              />
            </div>
            <div className="relative mb-3 w-5/6">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pr-10"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <span
                className="absolute inset-y-0 right-3 flex cursor-pointer items-center pl-3"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            <div className="mb-3 w-5/6">
              <div className="relative">
                <input
                  type={showRePassword ? "text" : "password"}
                  className="form-control pr-10"
                  placeholder="Confirm Password"
                  value={rePassword}
                  onChange={handleRePasswordChange}
                />
                <span
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center pl-3"
                  onClick={toggleRePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showRePassword ? faEyeSlash : faEye} />
                </span>
              </div>
              {!incorrectPassword && (
                <p className="mx-2 mt-1 text-red-500">
                  Passwords do not match!
                </p>
              )}
            </div>
            <div className="relative mb-3 flex w-5/6 items-center">
              <input
                type="radio"
                id="hr"
                name="role"
                value="HR"
                checked={role === "HR"}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="hr" className="mr-5">
                HR
              </label>
              <input
                type="radio"
                id="employee"
                name="role"
                value="Employee"
                checked={role === "Employee"}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="employee">Employee</label>
            </div>

            <button
              type="submit"
              className={`mb-3 h-10 w-5/6 rounded-lg ${isFormValid()
                  ? "bg-blue-500 text-white"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
              disabled={!isFormValid()}
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
