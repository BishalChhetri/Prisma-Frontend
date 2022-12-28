import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import callApi from "../routes/api";

const updatePassword = () => {
  const navigate = useNavigate();
  if (localStorage.getItem("id") === null) {
    navigate("/sigin");
  }

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const onFormSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    if (
      formData.oldPassword === "" ||
      formData.newPassword === "" ||
      formData.confirmNewPassword === ""
    ) {
      return toast.info("Field cannot be empty!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
    if (formData.oldPassword === formData.newPassword) {
      return toast.warning("Please, Enter different password.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      return toast.error("Password doenot match.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
    const id = localStorage.getItem("id");
    try {
      const response = await callApi({
        url: "auth/updatePassword",
        method: "POST",
        data: {
          id,
          password: formData.oldPassword,
          newPassword: formData.newPassword,
        },
      });
      toast.success("Succesfully changed password.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      setTimeout(() => navigate("/signin"), 1000);
    } catch (e: any) {
      toast.error(`${e.response.data.message}`, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };
  return (
    <div>
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 ">
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-inherit shadow-md sm:max-w-md sm:rounded-lg">
          <form onSubmit={onFormSubmit}>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-white-700 undefined"
              >
                Old Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password"
                  className="block w-full mt-1 border-gray-300 rounded-md text-stone-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e) =>
                    setFormData({ ...formData, oldPassword: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-white-700 undefined"
              >
                New Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password"
                  className="block w-full mt-1 border-gray-300 rounded-md text-stone-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-white-700 undefined"
              >
                Confirm New Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password"
                  className="block w-full mt-1 border-gray-300 rounded-md text-stone-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmNewPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex  items-center justify-end mt-4">
              <button
                type="submit"
                className="inline-flex items-center  px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-red-800 border border-transparent rounded-md active:bg-gray-900 false"
              >
                Update
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default updatePassword;
