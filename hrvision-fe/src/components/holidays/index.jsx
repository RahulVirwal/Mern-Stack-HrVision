import React, { useCallback, useEffect, useState } from "react";
import HolidayCard from "components/holidaycard";
import YearDropdown from "./YearDropdown";
import Button from "components/button/Button";
import Modal from "./Modal";
import axios from "axios";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Cookies from "js-cookie";
import Loader from "components/Loader/Loader";
import CardView from "../../assets/Icon/cardview.svg";
import TableIcon from "../../assets/Icon/table view.svg";
import TableView from "./TableView";
import { toast } from "react-toastify";

const data = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentYear = new Date().getFullYear();


const Holidays = () => {
  const [loading, setLoading] = useState(true);
  const [btnClick, setBtnClick] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [cardData, setCardData] = useState({});
  const role = Cookies.get("type");
  const [errors, setErrors] = useState({});
  const [CardButton, setCardButton] = useState(true);
  const [tableButton, setTableButton] = useState(false);
  const [save, setSave] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const authToken = Cookies.get("jwt-token");
  const holidayData = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}holiday/all`, {
        headers: {
          "jwt-token": authToken,
        },
      })
      .then((response) => {
        const jsondata = response.data;
        if (jsondata.status === "ok") {
          setCardData(jsondata?.data);
        } else {
          throw new Error(jsondata.message);
        }
      })
      .catch((error) => {
        console.error("Error for Events:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authToken]);

  useEffect(() => {
    holidayData();
  }, [holidayData]);

  const createholidaydata = {
    date: selectedDate,
    name: description,
  };
  const closeModal = () => {
    setBtnClick(false);
    setSelectedDate(new Date());
    setDescription("");
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!description) newErrors.description = "Description is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}holiday/create`,
        createholidaydata,
        {
          headers: {
            "jwt-token": authToken || "",
          },
        }
      );

      if (response.data.status === "ok") {
        setSave((prev) => !prev);
        closeModal();
        holidayData();
        toast.success(response.data.message, "Success");
      } else {
        closeModal();
        toast.error(response.data.message, "Error");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message, "Error");
      closeModal();
      console.error("Error fetching holiday details:", error);
    }
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
    if (errors.description) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: "",
      }));
    }
  };

  return (
    <>
      <div
        className={`flex ${
          role === "Employee" ? "justify-end" : "justify-between"
        }  p-4`}
      >
        {(role === "Admin" || role === "HR") && (
          <div className="flex h-10 w-16 items-center justify-between rounded-lg border-2 border-gray-500">
            <button
              className={`${
                CardButton ? "bg-blue-600" : ""
              } h-full w-8 rounded-md p-1`}
              onClick={() => {
                setTableButton(false);
                setCardButton(true);
              }}
            >
              <img src={CardView} alt="" />
            </button>
            <button
              className={`${
                tableButton ? "bg-blue-600" : ""
              } h-full w-8 rounded-md p-1`}
              onClick={() => {
                setTableButton(true);
                setCardButton(false);
              }}
            >
              <img src={TableIcon} alt="" />
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        {" "}
        {(role === "Admin" || role === "HR") && tableButton && (
          <Button _onClick={() => setBtnClick(true)}>Add Holiday</Button>
        )}
      </div>

      {loading && (
        <div className="h-[60vh]">
          <Loader />
        </div>
      )}
      {!loading && CardButton && (
        <div
          className={`grid grid-cols-1 place-items-center gap-y-12 pb-8 md:grid-cols-2 lg:gap-x-8 xl:gap-x-8 2xl:grid-cols-3  3xl:grid-cols-4 ${
            btnClick ? "backdrop-blur-md" : ""
          }`}
        >
          {data.map((month, index) => (
            <div key={index} className="mx-4">
              {cardData[month] && cardData[month].length > 0 ? (
                <HolidayCard
                  key={index}
                  cardData={cardData[month]}
                  month={month}
                />
              ) : (
                <HolidayCard key={index} month={month} />
              )}
            </div>
          ))}
        </div>
      )}
      {!loading && tableButton && <TableView refeshData={save} />}
      <div onClick={closeModal}>
        <Modal isOpen={btnClick} onClose={closeModal}>
          <div
            className="h-fit w-[200px] xs:w-[250px] sm:w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-2 rounded-lg bg-gray-100 p-2 shadow-md hover:shadow-lg">
              <Calendar onChange={setSelectedDate} value={selectedDate} />
            </div>
            <textarea
              className="mt-4 w-full rounded border border-gray-300 p-2 capitalize"
              placeholder="Enter holiday title"
              value={description}
              onChange={handleChangeDescription}
              required
            />

            {errors.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description}</p>
            )}
            <button
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Holidays;
