import React, { useState } from "react";
import close from "../../../assets/Icon/close.svg";
import moment from "moment";
function FeedbackCard(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const truncateText = (text, length) => {
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + "...";
  };

  const descriptionLengthThreshold = 90;
  const truncatedDescription = truncateText(
    props.description,
    descriptionLengthThreshold
  );

  return (
    <>
      <div className="m-3 h-60 w-64 sm:h-52 sm:w-96  overflow-auto rounded-lg  border bg-white p-4 shadow-sm hover:shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-base text-gray-600 " title="Earned Leave">
            {props.name.toUpperCase()}
          </div>
          <div className="text-base text-gray-600 " title="Earned Leave">
            {new moment(props.date).format("DD/MM/YYYY")}
          </div>
        </div>

        <div className="text-center">
          <span className="text-black text-xl font-bold">{props.title}</span>
        </div>

        <div className="p-3">
          <div className="text-justify text-sm font-thin">
            {isExpanded ? props.description : truncatedDescription}
          </div>
          {props.description.length > descriptionLengthThreshold &&
            !isExpanded && (
              <button
                onClick={toggleModal}
                className="mt-2 text-blue-500 hover:underline"
              >
                Read More
              </button>
            )}
          {isExpanded && (
            <button
              onClick={toggleExpanded}
              className="mt-2 text-blue-500 hover:underline"
            >
              Show Less
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
         <div className="bg-black fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="relative mx-auto max-w-lg rounded-lg border-2 border-gray-500 bg-white p-4 shadow-lg">
            <button
              className="text-grey-500 absolute top-2 right-2 hover:text-gray-800"
              onClick={toggleModal}
            >
              <img src={close} alt="" className="h-6 w-6" />
            </button>
            <div className="mb-4 flex items-center justify-between">
              <div
                className="font-sm text-base text-gray-600"
                title="Earned Leave"
              >
                {props.name.toUpperCase()}
              </div>
            </div>
            <div className="text-center">
              <span className="text-black text-xl font-bold">
                {props.title}
              </span>
            </div>
            <div className="p-3">
              <div className="text-justify text-sm font-thin">
                {props.description}
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default FeedbackCard;
