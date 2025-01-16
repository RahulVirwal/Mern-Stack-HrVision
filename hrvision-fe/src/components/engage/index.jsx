import React, { useEffect, useState } from "react";
import PostCard from "components/card/PostCard";
import Person from "../../assets/img/avatars/Person.jpg";
import NoDataImage from "assets/img/layout/nodata.jpg";
import CreatePost from "./CreatePost";
import Create from "../../assets/img/layout/createPost.png";
import Cookies from "js-cookie";
import axios from "axios";
import Loader from "components/Loader/Loader";
import NoDataFound from "components/NoDataFound";
const Index = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const authToken = Cookies.get("jwt-token");
  const [cardData, setCardData] = useState([]);
  const myHeaders = new Headers();
  myHeaders.append("jwt-token", authToken || "");
  const handleClick = () => {
    setModalOpen(!isModalOpen);
  };
  const role = Cookies.get("type");

  const fetchEventData = async () => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}event/all`, {
        headers: myHeaders,
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
  };
  useEffect(() => {
    fetchEventData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  return (
    <div className="h-[full]">
      <div className="mb-6 rounded-md border bg-white p-4 sm:flex sm:flex-col ">
        <div className="flex items-center justify-between sm:items-center ">
          <div className="flex min-w-0 flex-grow flex-row items-center">
            <div className=" hidden h-16 w-16 rounded-lg bg-gray-300 xs:block">
              <img
                src={Person}
                alt="user"
                className="hidden rounded-lg xs:block"
              />
            </div>
            <div className="ml-4 flex flex-col">
              <div className=" text-base font-semibold leading-5">Hey,</div>
              <div className=" text-xs font-semibold leading-4 text-gray-400">
                Ready to dive in?
              </div>
            </div>
          </div>
          {role !== "Employee" && (
            <div className="ml-4 mt-1.5  flex flex-col items-center justify-center">
              <button
                className="flex h-12 w-12 items-center justify-center"
                onClick={handleClick}
              >
                <img src={Create} alt="" className="h-10 w-10" />
              </button>
              <div className="text-sm  font-bold leading-4 text-gray-400">
                Create post
              </div>
            </div>
          )}
        </div>
      </div>
      {loading && (
        <div className="h-[60vh]">
          <Loader />
        </div>
      )}
      <div className="grid grid-cols-2 place-items-center p-4">
        {cardData &&
          cardData.map((item, index) => (
            <div key={index} className="sm:h-[425px] sm:w-[400px]  mb-8">
              {<PostCard data={item} fetchEventData={fetchEventData} />}
            </div>
          ))}

      </div>
      {cardData.length < 1 && !loading && <NoDataFound img={NoDataImage} />}

      {isModalOpen && (
        <div className="">
          <CreatePost
            onClose={() => setModalOpen(false)}
            fetchData={fetchEventData}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
