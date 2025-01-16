import React, { useCallback, useEffect, useState } from "react";
import Button from "components/button/Button";
import axios from "axios";
import close from "../../assets/Icon/close.svg";
import Cookies from "js-cookie";
import CreatePost from "components/engage/CreatePost";
import moment from "moment";
import useScreenSize from "./useScreenSize";
import { toast } from "react-toastify";

const PostCard = ({ data, fetchEventData }) => {
  const [editMode, setEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [descriptionLengthThreshold, setDescriptionLengthThreshold] = useState(30);
  const isSmallScreen = useScreenSize();
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const role = Cookies.get("type");
  const handleDelete = async () => {
    const authToken = Cookies.get("jwt-token");
    if (!authToken) {
      toast.error("Auth token is missing", "ERROR");
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_API_URL}event?id=${data._id}`,
        {
          headers: {
            "jwt-token": authToken,
          },
        }
      );
      if (response.data.status === "ok") {
        fetchEventData();
        toast.success("Event Deleted Successfully", "SUCCESS");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event", "ERROR");
    }
  };

  const handleUpdate = () => {
    setEditMode(true);
  };

  const truncateText = (text, length) => {
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + "...";
  };

  const hasHeadings = (text) => {
    const headingsRegex = /<h\d>/g;
    return headingsRegex.test(text);
  };

  const determineDescriptionLengthThreshold = useCallback(
    (text) => {
      if (isSmallScreen) {
        return hasHeadings(text) ? 10 : 40;
      }
      return hasHeadings(text) ? 20 : 80;
    },
    [isSmallScreen]
  );

  useEffect(() => {
    setDescriptionLengthThreshold(
      determineDescriptionLengthThreshold(data.description)
    );
  }, [data.description, determineDescriptionLengthThreshold]);

  const truncatedDescription = truncateText(
    data.description,
    descriptionLengthThreshold
  );

  return (
    <>
      <div className="mt-5 h-full w-[250px] rounded-lg bg-white px-2 shadow-md sm:w-[400px] sm:p-4">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-secondary-400 mt-2 text-sm">
              Created By {data.createdBy}
            </span>
          </div>
          <div className="relative flex items-center">
            <p className="mt-2 text-sm">
              {moment(data?.date).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-[280px]">
            <p className="text-center text-lg font-bold capitalize sm:text-xl">
              {data.title}
            </p>
            <div className="mt-4 flex items-center justify-center rounded-md">
              <img
                src={data.image}
                alt="img"
                width={150}
                height={150}
                className="h-[150px] w-[150px] hover:grayscale"
              />
            </div>
            <div
              dangerouslySetInnerHTML={
                  { __html: truncatedDescription }
              }
              className="ql-snow mt-2 text-center"
            />
            <div className="flex justify-end">
              {data.description.length > descriptionLengthThreshold && (
                <button
                  onClick={toggleModal}
                  className="text-blue-500 hover:underline"
                >
                  Read More
                </button>
              )}
            </div>
          </div>
          {role !== "Employee" && (
            <div className="mt-6 flex justify-end space-x-2">
              <Button
                className="rounded bg-red-500 px-2 py-2 text-white hover:bg-red-600"
                _onClick={handleDelete}
              >
                Delete
              </Button>
              <Button
                className="rounded bg-blue-500 px-2 py-2 text-white hover:bg-blue-600"
                _onClick={handleUpdate}
              >
                Update
              </Button>
            </div>
          )}
        </div>
        {editMode && (
          <CreatePost
            onClose={() => setEditMode(false)}
            fetchData={fetchEventData}
            data={data}
          />
        )}
      </div>

      {isModalOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="h-[500px] w-[250px] rounded-lg bg-white p-2 shadow-md sm:w-[450px]">
            <div className="flex justify-end">
              <button
                className="text-grey-500 hover:text-gray-800"
                onClick={toggleModal}
              >
                <img src={close} alt="Close" className="h-6 w-6" />
              </button>
            </div>
            <div className="flex justify-between px-4">
              <div className="flex flex-col">
                <span className="text-secondary-400 mt-1 text-sm">
                  Created By {data.createdBy}
                </span>
              </div>
              <div className="relative flex items-center">
                <p className="mt-1 text-sm">
                  {moment(data?.date).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-fit">
                <p className="text-center text-lg font-bold capitalize sm:text-xl">
                  {data.title}
                </p>
                <div className="mt-4 flex items-center justify-center rounded-md">
                  <img
                    src={data.image}
                    alt="img"
                    width={150}
                    height={150}
                    className="h-[150px] w-[150px] hover:grayscale"
                  />
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: data.description }}
                  className="ql-snow mt-4 h-[210px] overflow-y-auto text-center"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
