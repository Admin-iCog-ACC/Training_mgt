import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Trainers() {
  const [trainers, setTrainers] = useState(null);
  const [trainerDrawer, setTrainerDrawer] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    gender: "Male",
    phoneNumber: "",
    AreaofExpertise: "",
    experienceLevel: "",
    bio: "",
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const { setShowDrawer, showDrawer } = useOutletContext();
  const navigate = useNavigate();
  const fetchTrainers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/trainer", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")} `,
        },
      });
      console.log(res.data.trainers[0]);
      setTrainers(res.data.trainers);
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInput((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    console.log(name, input[name]);
  };
  const registerTrainer = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    console.log(registerLoading);
    try {
      const res = await axios.post("http://localhost:3000/api/trainer", input, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")} `,
        },
      });

      console.log(res.data.trainer);
      const newTrainer = res.data.trainer;
      //   setTimeout(() => {
      setTrainers((prev) => {
        return [{ projects: [], ...newTrainer }, ...prev];
      });
      setTrainerDrawer(false);
      setInput({
        firstName: "",
        lastName: "",
        email: "Male",
        address: "",
        gender: "",
        phoneNumber: "",
        AreaofExpertise: "",
        experienceLevel: "",
        bio: "",
      });
      //   }, 2000);

      toast.success("Trainer successfully registered!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
    } catch (error) {
      console.log(error);
    }
    setRegisterLoading(false);
  };

  const searchTrainers = (trainers) => {
    return trainers?.filter((trainer) =>
      trainer.email.toLowerCase().startsWith(searchEmail.toLowerCase().trim())
    );
  };

  useEffect(() => {
    fetchTrainers();
  }, []);
  return (
    <>
      <ToastContainer />
      <div
        id="drawer-contact"
        className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform border-l border-gray-600 bg-white w-[40%] dark:bg-gray-800 ${
          trainerDrawer ? "translate-x-1" : "translate-x-full"
        }`}
        tabindex="-1"
        aria-labelledby="drawer-contact-label"
      >
        <h5
          id="drawer-label"
          className="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          <svg
            viewBox="0 0 512 512"
            fill="currentColor"
            class={`w-4 h-4 me-2.5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white`}
          >
            <path d="M256 256a112 112 0 10-112-112 112 112 0 00112 112zm0 32c-69.42 0-208 42.88-208 128v64h416v-64c0-85.12-138.58-128-208-128z" />
          </svg>
          Trainer Registration
        </h5>
        <button
          onClick={() => setTrainerDrawer(false)}
          type="button"
          data-drawer-hide="drawer-contact"
          aria-controls="drawer-contact"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <form onSubmit={registerTrainer}>
          <div className="mb-8 flex gap-x-4 ">
            <section className="flex-1">
              <label
                for="firstName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="first Name"
                required
                value={input.firstName}
                onChange={handleInputChange}
              />
            </section>
            <section className="flex-1">
              <label
                for="lastName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Last Name"
                required
                value={input.lastName}
                onChange={handleInputChange}
              />
            </section>
          </div>
          <div className="mb-8 flex gap-x-4">
            <section className="flex-1">
              <label
                for="phoneNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Phone Number"
                required
                onChange={handleInputChange}
                value={input.phoneNumber}
              />
            </section>
            <section className="flex-1">
              <label
                for="address"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Address"
                required
                value={input.address}
                onChange={handleInputChange}
              />
            </section>
          </div>
          <div className="mb-8">
            <label
              for="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Email"
              required
              onChange={handleInputChange}
              value={input.email}
            />
          </div>

          <div className="mb-8 flex gap-x-4">
            <section className="flex-1">
              <label
                for="gender"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Gender
              </label>
              <select
                onChange={handleInputChange}
                name="gender"
                id="gender"
                value={input.gender}
                className="mb-4 sm:mb-0 mr-4 w-full inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </section>
            <section className="flex-1">
              <label
                for="expertise"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Expertise
              </label>

              <input
                type="text"
                id="expertise"
                name="AreaofExpertise"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Expertise"
                required
                value={input.lastName}
                onChange={handleInputChange}
              />
            </section>
            <section className="flex-1">
              <label
                for="expertise"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Experience Level
              </label>

              <input
                type="text"
                id="experienceLevel"
                name="experienceLevel"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Experience Level"
                required
                value={input.experienceLevel}
                onChange={handleInputChange}
              />
            </section>
          </div>

          <div className="mb-8">
            <label
              for="bio"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Bio
            </label>
            <textarea
              id="bio"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write a short trainer bio..."
              required
              name="bio"
              value={input.bio}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="flex gap-x-6">
            <button
              type="submit"
              value="register"
              className="text-white bg-gray-600 mt-4 hover:bg-gray-900 w-full focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            >
              {!registerLoading && "Register"}
              <div
                role="status"
                className={`text-white flex flex-col justify-center items-center gap-y-2 ${
                  registerLoading ? "block" : "hidden"
                }`}
              >
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span>Registering...</span>
              </div>
            </button>
            <button
              type="submit"
              onSubmit={(e) => registerTrainer(e, false)}
              value="another"
              className="text-white bg-gray-600 mt-4 hover:bg-gray-900 flex justify-center items-center w-full focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            >
              <svg
                class="w-5 h-5 mr-2 -ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Add another
              <div
                role="status"
                className={`text-white flex flex-col justify-center items-center gap-y-2 ${
                  false ? "block" : "hidden"
                }`}
              >
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span>Creating...</span>
              </div>
            </button>
          </div>
        </form>
      </div>
      <main>
        <div class="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
          <div class="w-full mb-1">
            <div class="mb-4">
              <nav class="flex mb-5" aria-label="Breadcrumb">
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
                        Trainers
                      </a>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                Trainers
              </h1>
            </div>
            <div class="sm:flex">
              <div class="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
                <form class="lg:pr-3" action="#" method="GET">
                  <label for="users-search" class="sr-only">
                    Search
                  </label>
                  <div class="relative mt-1 lg:w-64 xl:w-96">
                    <input
                      type="text"
                      name="email"
                      id="users-search"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Search for users"
                      onChange={(e) => setSearchEmail(e.target.value)}
                    />
                  </div>
                </form>
                <div class="flex pl-0 mt-3 space-x-1 sm:pl-2 sm:mt-0">
                  <a
                    href="#"
                    class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div class="flex items-center ml-auto space-x-2 sm:space-x-3">
                <button
                  onClick={() => {
                    setTrainerDrawer(true);
                    if (showDrawer) {
                      setShowDrawer(false);
                    }
                  }}
                  type="button"
                  data-modal-toggle="add-user-modal"
                  class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center border border-gray-600 text-white rounded-lg bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  <svg
                    class="w-5 h-5 mr-2 -ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Add
                </button>
                <a
                  href="#"
                  class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                >
                  <svg
                    class="w-5 h-5 mr-2 -ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Export
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
              <div class="overflow-y-auto  h-[700px]  shadow">
                <table class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Trainer
                      </th>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Gender
                      </th>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Phone Number
                      </th>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Expertise
                      </th>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Working on
                      </th>
                      <th
                        scope="col"
                        class="p-4 text-xs text-center font-medium  text-gray-500 uppercase dark:text-gray-400"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class=" divide-y divide-gray-200   dark:bg-gray-800 dark:divide-gray-700">
                    {searchTrainers(trainers)?.map((trainer) => {
                      return (
                        <tr
                          key={trainer.id}
                          onClick={() =>
                            navigate(`/admin/trainer/detail/${trainer.id}`)
                          }
                          class="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <td class="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
                            <img
                              class={`w-10 h-10 rounded-full ${
                                trainer.profileImage ? "block" : "hidden"
                              }`}
                              src={trainer.profileImage}
                              alt="Neil Sims avatar"
                            />
                            <section
                              className={`w-10 h-10 rounded-full bg-gray-900 ${
                                trainer.profileImage ? "hidden" : "block"
                              }`}
                            >
                              <svg
                                viewBox="0 0 512 512"
                                fill="currentColor"
                                height="1em"
                                width="1em"
                                className={`inline w-full h-full transition duration-100 transform  rounded-[50%] `}
                              >
                                <path d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 01-6.14-.32 124.27 124.27 0 00-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 00-32.35 29.58 4 4 0 01-6.14.32A175.32 175.32 0 0180 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 01-46.68 119.25z" />
                                <path d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z" />
                              </svg>
                            </section>
                            <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                              <div class="text-base font-semibold text-gray-900 dark:text-white">
                                {trainer.firstName} {trainer.lastName}
                              </div>
                              <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                                {trainer.email}
                              </div>
                            </div>
                          </td>
                          <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                            {trainer.gender}
                          </td>
                          <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {trainer.phoneNumber}
                          </td>
                          <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {trainer.address}
                          </td>

                          <td class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                            <div class="flex items-center">
                              <div class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>{" "}
                              {trainer.AreaofExpertise}
                            </div>
                          </td>
                          <td class="p-4 text-base  text-gray-400 whitespace-nowrap ">
                            {
                              trainer.Projects.filter(
                                (project) => project.status === "Completed"
                              ).length
                            }{" "}
                            Project(s)
                          </td>
                          <td class="p-4  whitespace-nowrap ">
                            <div className="flex justify-center gap-x-4">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/admin/trainer/detail/${trainer.id}`
                                  )
                                }
                                data-modal-toggle="delete-user-modal"
                                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                              >
                                Detail
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Trainers;
