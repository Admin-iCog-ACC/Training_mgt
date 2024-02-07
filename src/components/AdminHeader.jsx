import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropDown, setDropDown] = useState(false);
  const [fileInputError, setFileInputError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    span: "",
    priority: "",
    budget: "",
    overview: "",
    description: "",
    imageURL: "",
  });
  const [selectedRoute, setSelectedRoute] = useState({
    name: "projects",
  });
  const [showDrawer, setShowDrawer] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInput((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleFileInput = (e) => {
    const file = e.target.files["0"];
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setFileInputError(true);
      return;
    }
    setFileInputError(false);

    const reader = new FileReader();

    reader.onload = () => {
      handleInputChange({ target: { name: "imageURL", value: reader.result } });
    };

    reader.readAsDataURL(file);
  };

  const changeRoute = ({ name }) => setSelectedRoute({ name });

  const createProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/project", input, {
        headers: {
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWRtaW4iOnRydWUsImVtYWlsIjoiYXJzZW5hbGd1bm5lcjYzMjZAZ21haWwuY29tIiwiaWF0IjoxNzA2ODAxMTQ2fQ.iBqM6CbSQtS7rDQfzLbVUf0FdkPqx3JKDXpet1LbEks",
        },
      });
      console.log(res.data);
      toast.success("Project successfully created!", {
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
      navigate("/projects");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const verifyRequest = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/verify", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")} `,
        },
      });
      console.log(res.data);

      const value = res.data;
      value.admin && localStorage.setItem("adminId", value.id);
      !value.admin && localStorage.setItem("userId", value.id);
      setUser(value);
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    verifyRequest();
  }, []);

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col ">
      <ToastContainer />
      <div
        id="drawer-contact"
        className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform border-l border-gray-600 bg-white w-[30%] dark:bg-gray-800 ${
          showDrawer ? "translate-x-1" : "translate-x-full"
        }`}
        tabindex="-1"
        aria-labelledby="drawer-contact-label"
      >
        <h5
          id="drawer-label"
          className="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            class={`w-4 h-4 me-2.5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white`}
          >
            <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM368 744c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v464zm192-280c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v184zm192 72c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v256z" />
          </svg>
          Create Project
        </h5>
        <button
          onClick={() => setShowDrawer(false)}
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
        <form onSubmit={createProject}>
          <div className="mb-4">
            <label
              for="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="project title"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              for="location"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="project location"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4 flex gap-x-4 ">
            <section className="flex-1">
              <label
                for="budget"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Budget
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="project budget"
                required
                onChange={handleInputChange}
              />
            </section>
            <section className="flex-1">
              <label
                for="span"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Span
              </label>
              <input
                type="text"
                id="span"
                name="span"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="project span"
                required
                onChange={handleInputChange}
              />
            </section>
          </div>
          <div className="mb-4 flex gap-x-4">
            <section className="flex-1">
              <label
                for="priority"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Priority
              </label>
              <select
                onChange={handleInputChange}
                name="priority"
                id="priority"
                className="mb-4 sm:mb-0 mr-4 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                <option value="Low">Low</option>
                <option value="Intermediate">Intermediate</option>
                <option value="High">High</option>
              </select>
            </section>
            <section className="flex-1">
              <label
                for="status"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Status
              </label>
              <select
                onChange={handleInputChange}
                name="status"
                id="status"
                className="mb-4 sm:mb-0 mr-4 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                <option value="On Hold">On Hold</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Not Started">Not Started</option>
              </select>
            </section>
          </div>

          <div className="mb-4">
            <section className="flex justify-between items-center">
              <div className="flex-1">
                <label htmlFor="start" className="text-gray-400 text-sm">
                  Start:{" "}
                </label>

                <input
                  type="date"
                  placeholder="start date"
                  className="text-white bg-gray-700 p-2"
                  id="start"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="start" className="text-gray-400 text-sm">
                  End:{" "}
                </label>

                <input
                  type="date"
                  placeholder="start date"
                  className="text-white bg-gray-700 p-2"
                  id="start"
                  required
                  name="endDate"
                  onChange={handleInputChange}
                />
              </div>
            </section>
          </div>

          <div className="mb-4">
            <label
              for="overview"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Overview
            </label>
            <textarea
              id="overview"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write short project overview..."
              required
              name="overview"
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              for="description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write detail description about the project..."
              required
              name="description"
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="image"
            >
              Project Image
            </label>
            <input
              class="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="image"
              name="image"
              type="file"
              required
              onChange={handleFileInput}
            ></input>
            <span
              className={`text-red-500 ${fileInputError ? "block" : "hidden"}`}
            >
              only image/jpeg, image/png, image/jpg files allowed
            </span>
          </div>
          <button
            type="submit"
            className="text-white bg-gray-600 mt-4 hover:bg-gray-900 w-full focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
          >
            {!loading && "Create Project"}
            <div
              role="status"
              className={`text-white flex flex-col justify-center items-center gap-y-2 ${
                loading ? "block" : "hidden"
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
        </form>
      </div>
      <div className="h-[70px] flex items-center border-b border-gray-600 px-2">
        <div className="w-[256px] flex items-center gap-4  px-4">
          <section className="w-[40px] h-[40px]  rounded-[50%] ">
            <img
              src="https://icogacc.com/storage/myfiles/logo-web_sm.png"
              className=" w-full h-full rounded-[50%]"
              alt=""
            />
          </section>
          <h1 className="font-bold text-xl text-white">iCog-ACC</h1>
        </div>
        <div className="flex-1 flex items-center justify-end ">
          <div
            className="flex items-center gap-4 transition transform duration-75 hover:bg-gray-600 px-3 py-2 rounded cursor-pointer"
            onClick={() => setDropDown((prev) => !prev)}
          >
            <span>{user?.email}</span>
            <section className="flex items-center gap-2">
              <img
                src={user?.imageURL}
                alt=""
                className={`w-[40px] h-[40px] rounded-[50%] ${
                  user?.imageURL ? "block" : "hidden"
                }`}
              />
              <svg
                viewBox="0 0 512 512"
                fill="currentColor"
                height="1em"
                width="1em"
                className={`inline w-[40px] h-[40px] transition duration-100 transform cursor-pointer rounded-[50%]  hover:bg-gray-600 ${
                  user?.imageURL ? "hidden" : "block"
                }`}
              >
                <path d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 01-6.14-.32 124.27 124.27 0 00-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 00-32.35 29.58 4 4 0 01-6.14.32A175.32 175.32 0 0180 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 01-46.68 119.25z" />
                <path d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z" />
              </svg>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                // className="{ 'rotate-180': open, 'rotate-0': !open }"
                className={`inline w-5 h-5 transition duration-100 transform cursor-pointer rounded-[50%]  hover:bg-gray-600 ${
                  dropDown ? "rotate-180" : "rotate-0"
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </section>
          </div>
        </div>
      </div>
      <div className="flex flex-1 ">
        <div className="border-r border-gray-600 w-[256px] px-4 ">
          <section className="py-8 flex flex-col gap-y-2">
            <div
              onClick={() => changeRoute({ name: "projects" })}
              class={`flex items-center p-2 text-base text-gray-900 rounded-lg cursor-pointer ${
                selectedRoute.name == "projects" && "bg-gray-700"
              } group dark:text-gray-200 hover:bg-gray-700`}
            >
              <svg
                viewBox="0 0 1024 1024"
                fill="currentColor"
                class={`w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white`}
              >
                <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM368 744c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v464zm192-280c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v184zm192 72c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v256z" />
              </svg>

              <div
                class={`ml-3 flex flex-1 items-center justify-between text-white ${
                  selectedRoute.name == "projects" && "text-white"
                }`}
                sidebar-toggle-item=""
              >
                Projects
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  // className="{ 'rotate-180': open, 'rotate-0': !open }"
                  className={`inline w-5 h-5 transition duration-100 transform cursor-pointer rounded-[50%]`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
            <section
              className={`my-2 px-2 ml-3  ${
                selectedRoute.name == "projects" ? "block" : "hidden"
              }`}
            >
              <div
                onClick={() => {
                  setShowDrawer(false);
                  navigate("/projects");
                }}
                class={`px-6 py-3  text-sm text-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700`}
              >
                View Projects
              </div>
              <div
                onClick={() => {
                  setShowDrawer((prev) => !prev);
                }}
                class={`px-6 py-3  text-sm text-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700`}
              >
                Create Project
              </div>
            </section>
            <div
              onClick={() => changeRoute({ name: "trainers" })}
              class={`flex items-center p-2 text-base text-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700  ${
                selectedRoute.name == "trainers" && "bg-gray-700"
              }`}
            >
              <svg
                viewBox="0 0 512 512"
                fill="currentColor"
                class="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
              >
                <path d="M256 256a112 112 0 10-112-112 112 112 0 00112 112zm0 32c-69.42 0-208 42.88-208 128v64h416v-64c0-85.12-138.58-128-208-128z" />
              </svg>
              <div
                class={`ml-3 flex flex-1 items-center justify-between`}
                sidebar-toggle-item=""
              >
                Trainers
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  // className="{ 'rotate-180': open, 'rotate-0': !open }"
                  className={`inline w-5 h-5 transition duration-100 transform cursor-pointer rounded-[50%]  ${
                    selectedRoute.name == "trainers" && "text-white"
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
          </section>
        </div>
        <div className="p-3 bg-gray-800 flex-1">
          <Outlet context={{ showDrawer, user, setUser, setShowDrawer }} />
        </div>
      </div>
    </div>
  );
}
