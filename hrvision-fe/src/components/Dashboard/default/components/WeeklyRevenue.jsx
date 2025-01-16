import Card from "components/card";
import { useCallback, useEffect, useState } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import Loader from "components/Loader/Loader";
import { Calendar } from "react-calendar";
import { useNavigate } from "react-router-dom";
import Close from "../../../../assets/Icon/close.svg"
const WeeklyRevenue = () => {
  // State Management
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [toDayEvent, setToDayEvent] = useState([]);
  const [date, setDate] = useState(new Date());
  const authToken = Cookies.get("jwt-token");
  const navigate=useNavigate();

  // Fetch Event Data
  const fetchEventData = useCallback(
    async (value) => {
      try {
        const formattedDate = value ? `?date=${moment(value).format("YYYY-MM-DD")}` : "";
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}event/bydate${formattedDate}`,
          { headers: { "jwt-token": authToken || "" } }
        );

        if (response.data.status === "ok") {
          setToDayEvent(response.data.data);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally {
        setLoading(false);
      }
    },
    [authToken]
  );

  // Handle Date Change
  const handleDateChange = (newDate) => {
    setDate(newDate);
    setIsCalendarOpen(false);

    const formattedNewDate = moment(newDate).format("YYYY-MM-DD");
    const formattedCurrentDate = moment().format("YYYY-MM-DD");

    if (formattedNewDate === formattedCurrentDate) {
      setSearchParams({});
    } else {
      setSearchParams({ date: formattedNewDate });
    }
  };

  // Show More Modal
  const handleShowMore = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch Events on Component Mount or URL change
  useEffect(() => {
    const dateParam = searchParams.get("date");
    const dateToFetch = dateParam ? new Date(dateParam) : new Date();
    setDate(dateToFetch);
    fetchEventData(dateToFetch);
  }, [fetchEventData, searchParams]);

  return (
    <>
      <Card extra="w-full h-[350px] lg:h-[425px] p-6 bg-white dark:bg-navy-800 dark:text-white">
        <div>
          <header className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
            <h1 className="text-xl font-bold text-navy-700 dark:text-white">
              Today's Events
            </h1>
            <button
              className="flex items-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
              onClick={() => setIsCalendarOpen(true)}
            >
              <MdOutlineCalendarToday />
              <span className="text-sm font-medium">
                {moment(date).format("ddd, MMM DD, YYYY")}
              </span>
            </button>
          </header>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 overflow-x-auto overflow-y-hidden text-lg font-bold text-green-700 sm:grid-flow-row sm:grid-cols-2 lg:text-xl xl:h-[350px] xl:overflow-x-hidden" >
          {loading ? (
            <div className="flex h-full absolute w-full -mt-20 items-center justify-center">
              <Loader />
            </div>
          ) : toDayEvent.length > 0 ? (
            toDayEvent.slice(0, 2).map((event, index) => (
              <div
                key={index}
                className="mb-6 flex h-full w-full flex-col items-center justify-center rounded-lg bg-gray-50 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-navy-700 sm:w-[90%] hover:cursor-pointer hover:bg-gray-100 "
                onClick={()=>navigate("/event")}
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-white capitalize">
                  {event.title}
                </h3>
                <img
                  src={event.image}
                  alt=""
                  className="mb-2 h-[150px] w-[150px] rounded-md object-cover"
                />
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {moment(event.createdAt).format("DD-MM-YYYY")}
                </h3>
              </div>
            ))
          ) : (
            <div className="col-span-2 flex h-full w-full items-center justify-center">
              <span className="text-lg text-gray-500 dark:text-gray-400">
                No Data Found
              </span>
            </div>
          )}
          {toDayEvent.length > 2 && (
            <button
              onClick={handleShowMore}
              className="col-span-2 mx-auto mb-2 rounded bg-lightPrimary py-2 px-4 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
            >
              Show More
            </button>
          )}
        </div>
      </Card>

      {isCalendarOpen && (
        <div
          className="absolute inset-0 z-50 flex items-start justify-end top-[200px] right-[20px]"
          onClick={() => setIsCalendarOpen(false)}
        >
          <div
            className="w-[90%] max-w-sm rounded-lg bg-white shadow-lg dark:bg-navy-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <Calendar onChange={handleDateChange} value={date} />
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-navy-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-center text-2xl font-bold text-navy-700 dark:text-white">
              All Events
            </h2>
            <div className="max-h-[400px] space-y-4 overflow-y-auto">
              {toDayEvent.map((event, index) => (
                <div
                  key={index}
                  className="w-full rounded-lg bg-gray-50 p-4 text-gray-800 shadow-md dark:bg-navy-600 dark:text-gray-200"
                  onClick={()=>navigate("/event")}
                >
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                </div>
              ))}
            </div>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-500"
              onClick={closeModal}
            >
              <img src={Close} alt="X" className="h-6 w-6"/>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WeeklyRevenue;
