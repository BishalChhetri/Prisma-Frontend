import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import callApi from "../routes/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem("jwttoken") !== null) {
      return navigate("/tasks");
    }
  }, []);

  const onFormSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Password doesn't matches!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
    if (formData.name.length === 0 || formData.email.length === 0) {
      return toast.warning("Please enter all credentials!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
    try {
      const response = await callApi({
        url: "auth/signup",
        method: "POST",
        data: formData,
      });
      toast.success("Succesfully created Account!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (e: any) {
      toast.error(`${e.response.data.message}`, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };
  return (
    <div>
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 ">
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-inherit sm:max-w-md sm:rounded-lg">
          <form onSubmit={onFormSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-white-700 undefined"
              >
                Name
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="text"
                  name="name"
                  className="block w-full mt-1 border-gray-300 rounded-md text-stone-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-white-700 undefined"
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
                className="block text-sm font-bold text-white-700 undefined"
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
            <div className="mt-4">
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-bold text-white-700 undefined"
              >
                Confirm Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password_confirmation"
                  className="block w-full mt-1 border-gray-300 rounded-md text-stone-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-end mt-4">
              <Link
                className="text-sm text-white-600 underline hover:font-bold"
                to="/signin"
              >
                {" "}
                Already have an account?
              </Link>

              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-red-900 border border-transparent rounded-md active:bg-gray-900 false"
              >
                Sign Up
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
