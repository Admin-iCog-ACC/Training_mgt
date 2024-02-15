import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer, Flip } from "react-toastify";

function ProjectLeadRegistration() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    address: "",
    phoneNumber: "",
    email: "",
  });
  const [registering, setRegistering] = useState(false);
  console.log(user);
  const registerAdmin = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      const res = await axios.post("http://localhost:3000/api/admin", user, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res.data);
      toast.success("Project lead registered!", {
        position: "top-right",
        autoClose: 1999,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Email and/or phone number already used.", {
          position: "top-right",
          autoClose: 1999,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
        });
      }
      console.log(error);
    }
    setRegistering(false);
  };
  return (
    <div className="flex flex-col h-full">
      <ToastContainer />

      <div class="mb-2 flex justify-between items-start">
        <nav class="flex " aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
            <li class="inline-flex items-center">
              <a
                href="#"
                class="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-2.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Home
              </a>
            </li>
            <li>
              <div class="flex items-center">
                <svg
                  class="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <a
                  href="#"
                  class="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white"
                >
                  Project Leads
                </a>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg
                  class="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <a
                  href="#"
                  class="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white"
                >
                  Register
                </a>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      <div className="py-20">
        <div class=" mx-64 py-4 mb-4  border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 class="mb-4 text-xl font-semibold dark:text-white">
            Admin Registration
          </h3>
          <form onSubmit={registerAdmin}>
            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="first-name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your first name"
                  required
                  value={user.firstName}
                  onChange={(e) =>
                    setUser((prev) => {
                      return { ...prev, firstName: e.target.value };
                    })
                  }
                />
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="last-name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your last name"
                  required
                  value={user.lastName}
                  onChange={(e) =>
                    setUser((prev) => {
                      return { ...prev, lastName: e.target.value };
                    })
                  }
                />
              </div>

              <div class="col-span-6 sm:col-span-3">
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your email"
                  required
                  value={user.email}
                  onChange={(e) =>
                    setUser((prev) => {
                      return { ...prev, email: e.target.value };
                    })
                  }
                />
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="gender"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Gender
                </label>
                <select
                  onChange={(e) =>
                    setUser((prev) => {
                      return { ...prev, gender: e.target.value };
                    })
                  }
                  name="gender"
                  id="gender"
                  value={user.gender}
                  className="w-full mb-4 sm:mb-0 mr-4 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="address"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your address"
                  required
                  value={user.address}
                  onChange={(e) =>
                    setUser((prev) => {
                      return { ...prev, address: e.target.value };
                    })
                  }
                />
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="phoneNumber"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contact No.
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your Phone Number"
                  required
                  value={user.phoneNumber}
                  onChange={(e) =>
                    setUser((prev) => {
                      return { ...prev, phoneNumber: e.target.value };
                    })
                  }
                />
              </div>
              <div class="col-span-6 sm:col-full">
                <button
                  className={`${
                    registering ? "hidden" : "block"
                  } py-2 px-6 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
                  type="submit"
                >
                  Register
                </button>
                <button
                  className={`${
                    registering ? "block" : "hidden"
                  } py-2 px-6 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
                >
                  Registering...
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProjectLeadRegistration;
