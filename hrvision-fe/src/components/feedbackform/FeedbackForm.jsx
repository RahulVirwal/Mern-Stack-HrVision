import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Button from "components/button/Button";
import FeedBackHistory from "./FeedBackHistory";
import { toast } from "react-toastify";

export default function FeedbackForm() {
  const authToken = Cookies.get("jwt-token");
  const myHeaders = new Headers();
  const [btnClick, setBtnClick] = useState(false);
  myHeaders.append("jwt-token", authToken || "");

  const [formData, setFormData] = useState({
    title: "",
    feedback: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    setBtnClick(false);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      description: formData.feedback,
    };
    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}feedback/apply`, data, {
        headers: {
          "jwt-token": authToken,
        },
      })
      .then((response) => {
        if (response.data?.status === "ok") {
          toast.success(response?.data?.message, "SUCCESS");
          clearFormData();
        } else {
          toast.error(response?.data?.message, "ERROR");
          throw new Error(response.message);
        }
      })
      .catch((error) => {
        console.log("Error for Events:", error);
      });
  };
  const clearFormData = () => {
    setFormData({
      title: "",
      feedback: "",
    });
  };
  return (
    <>
      <div className="flex justify-end">
        <Button _onClick={() => setBtnClick(!btnClick)}>
          {btnClick ? "Feedback Form" : "History"}
        </Button>
      </div>
      <div className="flex h-[83vh] justify-center">
        {btnClick === false ? (
          <div className="h-fit w-full max-w-lg rounded-lg bg-white p-8 shadow-sm hover:shadow-lg">
            <h2 className="text-center text-lg font-semibold text-gray-800 sm:text-2xl">
              Feedback Form
            </h2>
            <form
              className="mt-6"
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title<span className="font-bold text-red-900">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter Title"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="feedback"
                  className="block text-sm font-medium text-gray-700"
                >
                  Feedback<span className="font-bold text-red-900">*</span>
                </label>
                <textarea
                  name="feedback"
                  id="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your feedback"
                  rows="10"
                  required
                ></textarea>
              </div>
              <div className="flex items-center justify-end ">
                <button
                  type="submit"
                  className="mr-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:bg-blue-600 focus:outline-none"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500 focus:outline-none "
                  onClick={clearFormData}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <FeedBackHistory />
        )}
      </div>
    </>
  );
}
