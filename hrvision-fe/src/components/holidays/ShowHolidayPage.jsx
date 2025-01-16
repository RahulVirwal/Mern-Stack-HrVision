import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const ShowHolidayPage = ({ data, holidayData, onClose }) => {
  const authToken = Cookies.get("jwt-token");
  const [isEditing, setIsEditing] = useState(false);
  const[isDirty,setIsDirty]=useState(false);
  const [editData, setEditData] = useState({
    id: data._id,
    name: data.name,
    date: data.date,
  });

  const handleDelete = () => {
    axios
      .delete(`${process.env.REACT_APP_BASE_API_URL}holiday/delete`, {
        headers: {
          "jwt-token": authToken,
        },
        params: {
          id: data._id,
        },
      })
      .then((response) => {
        const jsondata = response?.data;
        if (jsondata.status === "ok") {
          toast.success(jsondata.message, "SUCCESS");
          onClose();
          holidayData();
        } else {
          throw new Error(jsondata.message);
        }
      })
      .catch((error) => {
        console.error("Error for Holidays:", error);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setIsDirty(true);
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = () => {
    axios
      .put(
        `${process.env.REACT_APP_BASE_API_URL}holiday/update`,
        {
          id: editData.id,
          name: editData.name,
          date: editData.date,
        },
        {
          headers: {
            "jwt-token": authToken,
          },
        }
      )
      .then((response) => {
        const jsondata = response?.data;
        if (jsondata.status === "ok") {
          toast.success(jsondata.message, "SUCCESS");
          onClose();
          holidayData();
        } else {
          throw new Error(jsondata.message);
        }
      })
      .catch((error) => {
        console.error("Error updating holiday:", error);
      });
  };

  return (
    <div className="mt-3 flex h-full items-center justify-center overflow-x-hidden overflow-y-hidden text-gray-700">
      <div
        className={`mt-3 flex ${
          isEditing ? "h-[300px]" : "h-[200px]"
        } w-[250px] flex-col space-y-6 bg-white md:h-full md:w-[400px]`}
      >
        {isEditing ? (
          <>
            <div>
              <h2 className="text-3xl font-semibold text-blue-800">
                Edit Holiday
              </h2>
            </div>
            <div className="">
              <label className="text-base font-bold text-gray-800">Name</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                className="block w-full rounded-md border-2 border-gray-300 p-2  shadow-sm"
              />
            </div>
            <div>
              <label className="text-base font-bold text-gray-800">Date</label>
              <input
                type="date"
                name="date"
                value={editData.date.split("T")[0]}
                onChange={handleEditChange}
                className="block w-full rounded-md border-2 border-gray-300 p-2  shadow-sm"
              />
            </div>
            <div className="mt-6 mr-4 flex justify-end space-x-4 md:mr-0">
              <button
                onClick={handleEditSubmit}
                className={`rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 ${!isDirty?"bg-gray-400":""}`}
                disabled={!isDirty}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-md bg-gray-500 px-4 py-2 text-white shadow-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-3xl font-semibold text-blue-800">
                {data.name}
              </h2>
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-800">Date</h4>
              <p className="text-sm">{new Date(data.date).toDateString()}</p>
            </div>
            <div className="mt-6 mr-4 flex items-end justify-end space-x-4 md:mr-0">
              <button
                onClick={handleEdit}
                className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-500 px-4 py-2 text-white shadow-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShowHolidayPage;
