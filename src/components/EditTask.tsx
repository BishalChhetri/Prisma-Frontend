import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useQuery } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Modal";

import callApi from "../routes/api";

const EditTask = (props: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleModalClose = () => {
    props.closeEditTaskModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title && !description) {
      handleModalClose();
      return;
    }

    if (title && title.length < 3) {
      setErrorMsg("Please enter valid title.");
      return;
    }
    if (description && description.length < 8) {
      setErrorMsg("Please enter valid description.");
      return;
    }

    try {
      const data = {
        title,
        description,
        isCompleted: props.task[0].isCompleted,
      };
      if (!data.title && data.description) {
        data.title = props.task[0].title;
      }
      if (!data.description && data.title) {
        data.description = props.task[0].description;
      }
      const response = await callApi({
        url: `tasks/${localStorage.getItem("id")}/update/${props.task[0].id}`,
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwttoken"),
        },
        data,
      });

      toast.info("Save Sucessfully!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      handleModalClose();
      setTitle("");
      setDescription("");
    } catch (e: any) {
      console.log(e);
      return toast.error(`${e.response.data.message}`, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  return (
    <Modal isOpen={props.isOpen} closeModal={handleModalClose}>
      <form onSubmit={handleSubmit} className="md:py-1 md:px-1">
        <h1 className="text-center text-black text-2xl font-semi-bold m-3">
          Edit Task
        </h1>

        {errorMsg.length ? (
          <p className="text-gray-600 bg-[#F9BBBE] p-1 rounded-md font-medium">
            {errorMsg}
          </p>
        ) : null}
        <div className="flex flex-col mb-4">
          <label className="text-black ">
            Title <span className="text-red-500">*</span>
          </label>
          {!props.task[0].isCompleted ? (
            <input
              style={{ fontFamily: "Poppins Light" }}
              className="inputField rounded-md text-black"
              type="text"
              placeholder="Enter title"
              defaultValue={props.task[0].title}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            <p className="text-gray-600 bg-[#F9BBBE] p-1 rounded-md font-medium">
              {props.task[0].title}
            </p>
          )}
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-black ">
            Description <span className="text-red-500">*</span>
          </label>
          {!props.task[0].isCompleted ? (
            <input
              style={{ fontFamily: "Poppins Light" }}
              className="inputField rounded-md text-black"
              type="text"
              placeholder="Enter description"
              defaultValue={props.task[0].description}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : (
            <p className="text-gray-600 bg-[#F9BBBE] p-1 rounded-md font-medium">
              {props.task[0].description}
            </p>
          )}
        </div>
        {!props.task[0].isCompleted ? (
          <div className="mt-8">
            <button
              type="button"
              onClick={handleModalClose}
              className="text-red-500 mx-5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-500  p-2 rounded-sm font-bold text-white"
            >
              Save Changes
            </button>
          </div>
        ) : null}
      </form>
      <ToastContainer />
    </Modal>
  );
};

export default EditTask;
