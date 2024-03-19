import axios from "axios";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/admin/login",
        input
      );

      localStorage.setItem("token", res.data.access_token);
      navigate("/admin/projects");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 400) {
        toast.error("Invalid credentials! Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Flip,
        });
      } else {
        toast.error("Login operation failed. Please try again!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Flip,
        });
      }
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  };
  return (
    <div class="flex min-h-screen flex-col justify-center  px-6 py-12 lg:px-8">
      <ToastContainer />

      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-[#168c9e]">
          Sign in to your account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" onSubmit={loginUser}>
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-6 text-gray-600"
            >
              Email address
            </label>
            <div class="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                onChange={handleInputChange}
                class="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm font-medium leading-6 text-gray-600"
              >
                Password
              </label>
              <div class="text-sm">
                <a
                  href="http://localhost:5173/change/password"
                  class="font-semibold text-gray-400 hover:text-gray-700"
                  target="blank"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div class="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                onChange={handleInputChange}
                class="block w-full px-2  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`flex w-full justify-center rounded-md bg-[#168c9e] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#1cb0c7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 ${
                loading ? "hidden" : "block"
              }`}
            >
              Sign in
            </button>
            <button
              type="submit"
              class={`flex w-full justify-center rounded-md text-gray-600 bg-gray-200 px-3 py-1.5 text-sm  leading-6  cursor-not-allowed ${
                loading ? "block" : "hidden"
              }`}
            >
              Loading....
            </button>
            <p className="text-sm mt-4 text-end text-gray-400 cursor-pointer hover:underline hover:text-gray-700">
              <NavLink to={"/trainer_login"}>Login as a Trainer</NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
