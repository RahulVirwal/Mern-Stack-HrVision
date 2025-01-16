import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/Login.css";
import logo from "../../logos/logo1.svg";
import { useState } from "react";
import Img from "../../assets/img/auth/cloud-native.png";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const authToken = Cookies.get("jwt-token");
  if (authToken) {
    window.location.href = "/";
    return null;
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {
      email,
      password,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setIsLoading(false);
        Cookies.set("jwt-token", result.token);
        Cookies.set("type", result.role);
        Cookies.set("projectManager", result.ProjectManager);
        toast.success("You have successfully logged in", "Success");
        window.location.href = `/`;
      } else {
        setIsLoading(false);
        console.error(result.error);
        toast.error(result.message, "Error");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      toast.error("server error", "Error");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-gray-300">
        <div className="grid h-[80%] w-[90%] grid-cols-1 rounded-lg bg-white md:grid-cols-2 xl:h-[70%] xl:w-[70%]">
          <div className="flex flex-col items-center justify-center p-8">
            <div>
              <img className="m-auto w-44 md:w-72" src={logo} alt="logo" />
            </div>
            <p className="text-md mb-8 mt-5 text-gray-500">
              Sign in to start your session
            </p>
            <form
              onSubmit={handleOnSubmit}
              className="flex w-full flex-col items-center"
            >
              <div className="relative mb-4 w-4/5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control w-full rounded-lg border px-4 py-2 pr-10"
                  placeholder="Email"
                  required
                />
                <span className="absolute inset-y-0 right-3 flex items-center pl-3">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </div>
              <div className="relative mb-4 w-4/5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control w-full rounded-lg border px-4 py-2 pr-10"
                  placeholder="Password"
                  required
                />
                <span
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center pl-3"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="h-10 w-4/5 rounded-lg bg-blue-500 text-white disabled:bg-opacity-50 "
              >
                Sign in
              </button>
            </form>
          </div>
          <div className="flex items-center justify-center overflow-hidden">
            <img src={Img} alt="Img" className="hidden md:block" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
