import React, { useEffect, useState, useRef } from "react";
import Modal from "./Model";
import Editor from "components/editor";
import Cookies from "js-cookie";
import axios from "axios";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

const CreatePost = ({ onClose, fetchData, data }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postDate, setPostDate] = useState(new Date());
  const [image, setImage] = useState();
  const fileInputRef = useRef(null);
  const authToken = Cookies.get("jwt-token");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      if (data.image) {
        const base64Image = data.image;
        const byteString = atob(base64Image.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: "image/jpeg" });
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        setImage(file);
        fileInputRef.current.files = createFileList(file);
      }
    }
  }, [data, postDate]);

  const createFileList = (file) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  };

  const handleSubmit = async (e) => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";
    if (!image) newErrors.image = "Image is required";
    e.preventDefault();
    const formData = new FormData();
    formData.append("date", postDate);
    formData.append("title", title);
    formData.append("description", description);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (image) {
      formData.append("image", image);
    }

    const url = `${process.env.REACT_APP_BASE_API_URL}event`;
    if (data) {
      formData.append("id", data?._id);
    }

    const method = data ? "put" : "post";

    axios({
      method: method,
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "jwt-token": authToken,
      },
    })
      .then((response) => {
        const jsondata = response.data;
        if (jsondata.status === "ok") {
          const successMessage = data
            ? "Event Updated Successfully"
            : "Event Created Successfully";
          toast.success(successMessage, "SUCCESS");
          fetchData();
          onClose();
        } else {
          throw new Error(jsondata.message);
        }
      })
      .catch((error) => {
        console.error("Error for Events:", error);
      });
  };
  const onChangeTitle = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: "",
      }));
    }
  };
  const handleFileUpload = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (
        fileType !== "image/jpeg" &&
        fileType !== "image/jpg" &&
        fileType !== "image/png"
      ) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = async () => {
          setImage(file);
        };
        img.src = reader.result.toString();
      };
      reader.readAsDataURL(file);
    }
    if (errors.image) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "",
      }));
    }
  };

  return (
    <>
      <Modal
        onClose={onClose}
        title={data ? "Update Post" : "Create New Post"}
        footerContent={
          <div className="flex justify-end">
            <button
              className="mr-2 rounded bg-gray-500 py-2 px-4 font-semibold text-white"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="rounded bg-blue-500 py-2 px-4 font-semibold text-white"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="relative z-50 space-y-4">
          <div>
            <label
              htmlFor="Post Date"
              className="block text-sm font-medium text-gray-700"
            >
              Post Date
            </label>
            <DatePicker
              selected={postDate}
              value={postDate}
              minDate={new Date()}
              onChange={(date) => setPostDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control mt-1 w-full rounded-md border-gray-300 py-2  pl-3 text-base shadow focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={onChangeTitle}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
              required
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Editor _onChange={setDescription} value={description} />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">
                {!description.length > 0 ? errors.description : ""}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="mt-1 block w-full cursor-pointer rounded-md border border-gray-300 p-1 text-sm text-gray-900"
              accept="image/*"
            />
            {errors.image && (
              <p className="mt-2 text-sm text-red-600">{errors.image}</p>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreatePost;
