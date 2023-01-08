import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import callApi from "../routes/api";

const SignIn = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("jwttoken") !== null) {
      return navigate("/tasks");
    }
  }, []);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const onFormSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    if (formData.email.length === 0 || formData.password.length === 0) {
      return toast.warning("Please, Enter email & password.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
    try {
      const response = await callApi({
        url: "auth/signin",
        method: "POST",
        data: formData,
      });
      localStorage.setItem("jwttoken", response.data.token);
      localStorage.setItem("id", response.data.id);
      toast.success("Logging in.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      setTimeout(() => navigate("/tasks"), 1000);
    } catch (e: any) {
      toast.error(`${e.response?.data.message}`, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };
  return (
    <div>
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 ">
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-inherit sm:max-w-md sm:rounded-lg">
          <form onSubmit={onFormSubmit}>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-white-900 undefined"
              >
                Email
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="email"
                  name="email"
                  className="block w-full mt-1 border-gray-300 rounded-md text-stone-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-white-900 undefined"
              >
                Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password"
                  className="block w-full mt-1 border-gray-300 rounded-md text-stone-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex  items-center justify-end mt-4">
              <Link
                className="text-sm text-white-600 underline hover:font-bold"
                to="/signup"
              >
                {" "}
                Don't have an account?
              </Link>

              <button
                type="submit"
                className="inline-flex items-center  px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-red-800 border border-transparent rounded-md active:bg-gray-900 false"
              >
                Sign In
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
