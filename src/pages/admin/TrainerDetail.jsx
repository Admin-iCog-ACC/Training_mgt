import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";

function TrainerDetail() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [completedProjectTitle, setCompletedProjectTitle] = useState("");
  const [appliedProjectTitle, setAppliedProjectTitle] = useState("");
  const [showDeleteTrainer, setShowDeleteTrainer] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteTrainer = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/trainer/${id}`, {
        headers: {
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWRtaW4iOnRydWUsImVtYWlsIjoiYXJzZW5hbGd1bm5lcjYzMjZAZ21haWwuY29tIiwiaWF0IjoxNzA2ODAxMTQ2fQ.iBqM6CbSQtS7rDQfzLbVUf0FdkPqx3JKDXpet1LbEks",
        },
      });
      await axios.delete(
        `http://localhost:3000/api/deleteFile/${trainer.profileImageId}`,
        {
          headers: {
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWRtaW4iOnRydWUsImVtYWlsIjoiYXJzZW5hbGd1bm5lcjYzMjZAZ21haWwuY29tIiwiaWF0IjoxNzA2ODAxMTQ2fQ.iBqM6CbSQtS7rDQfzLbVUf0FdkPqx3JKDXpet1LbEks",
          },
        }
      );
      await axios.delete(
        `http://localhost:3000/api/deleteFile/${trainer.CVId}`,
        {
          headers: {
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWRtaW4iOnRydWUsImVtYWlsIjoiYXJzZW5hbGd1bm5lcjYzMjZAZ21haWwuY29tIiwiaWF0IjoxNzA2ODAxMTQ2fQ.iBqM6CbSQtS7rDQfzLbVUf0FdkPqx3JKDXpet1LbEks",
          },
        }
      );

      toast.success("Trainer successfully deleted!", {
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
      setTimeout(() => {
        navigate("/admin/trainers");
      }, 2500);
      setShowDeleteTrainer(false);
    } catch (error) {
      console.log(error);
    }
    setDeleteLoading(false);
  };
  const filterCompletedProjects = () => {
    return trainer?.Projects?.filter(
      (project) =>
        project.status === "Completed" &&
        project.title
          .toLowerCase()
          .startsWith(completedProjectTitle.toLowerCase().trim())
    );
  };
  const filterAppliedProjects = () => {
    console.log(trainer?.Projects);
    return trainer?.Projects?.filter(
      (project) =>
        project.status === "In Progress" &&
        project.title
          .toLowerCase()
          .startsWith(appliedProjectTitle.toLowerCase().trim())
    );
  };
  const getTrainer = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/trainer/${id}`, {
        headers: {
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWRtaW4iOnRydWUsImVtYWlsIjoiYXJzZW5hbGd1bm5lcjYzMjZAZ21haWwuY29tIiwiaWF0IjoxNzA2ODAxMTQ2fQ.iBqM6CbSQtS7rDQfzLbVUf0FdkPqx3JKDXpet1LbEks",
        },
      });
      console.log(res.data.trainer);
      setTrainer(res.data.trainer);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTrainer();
  }, [id]);
  return (
    <div>
      <ToastContainer />

      <div
        id="popup-modal"
        tabindex="-1"
        style={{ background: "rgba(0,0,0,0.6)" }}
        class={`flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
          showDeleteTrainer ? "block" : "hidden"
        } `}
      >
        <div class="relative p-4 w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
              onClick={() => setShowDeleteTrainer(false)}
            >
              <svg
                class="w-3 h-3"
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
            </button>

            <div class="p-4 md:p-5 text-center">
              <img
                src={trainer?.profileImage}
                alt={trainer?.firstName}
                className={`w-12 h-12 rounded-full mx-auto mb-4 ${
                  trainer?.profileImage ? "block" : "hidden"
                }`}
              />
              <section
                className={`w-12 h-12 rounded-full mx-auto mb-4  ${
                  trainer?.profileImage ? "hidden" : "block"
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
              <section className="text-lg font-bold">
                {trainer?.firstName} {trainer?.lastName}
              </section>
              <section className="text-sm text-gray-300">
                {trainer?.email}
              </section>
              <h3 class="mb-5 mt-7 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this trainer?
              </h3>
              <div className="flex justify-center align-center">
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={deleteTrainer}
                  class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                >
                  {!deleteLoading && "Yes, I'm sure"}
                  <div
                    role="status"
                    className={`text-white flex  justify-center items-center gap-x-1 ${
                      deleteLoading ? "block" : "hidden"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-white"
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
                    <span>Deleting...</span>
                  </div>
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={() => setShowDeleteTrainer(false)}
                  class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section>
        <h1>Trainer</h1>
      </section>
      <section className=" flex gap-x-5">
        <section className="w-[38%]  rounded border border-gray-600  shadow   bg-gray-800 flex flex-col justify-between">
          <div className="p-5 ">
            <div className="flex items-center gap-x-4 mb-3">
              <section
                className={`w-[90px] h-[90px] rounded-full  ${
                  trainer?.profileImage ? "hidden" : "block"
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
              <img
                src={`${trainer?.profileImage}`}
                alt=""
                className={`w-[90px] h-[90px] rounded ${
                  trainer?.profileImage ? "visible" : "hidden"
                }`}
              />

              <div className="  flex-1">
                <span className="block font-bold text-lg">
                  {trainer?.firstName} {trainer?.lastName}
                </span>
                <span className="block text-sm text-gray-400">
                  {trainer?.email}
                </span>
                <span className="block text-sm text-gray-400">
                  {trainer?.phoneNumber}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <span className="block text-lg font-bold text-white">
                About Me
              </span>
              {trainer?.bio}
            </div>
            <div className="mt-3 ">
              <section className="flex items-center gap-x-4 mb-2">
                <span className="block text-sm font-bold">Gender</span>
                <span className="block text-gray-400 text-xs font-bold">
                  {trainer?.gender}
                </span>
              </section>
              <section className="flex items-center gap-x-4 mb-2">
                <span className="block text-sm font-bold"> Address</span>
                <span className="block text-gray-400 text-xs font-bold">
                  {trainer?.address}
                </span>
              </section>
              <section className="flex items-center gap-x-4 mb-2">
                <span className="block text-sm font-bold">Expertise</span>
                <span className="block text-gray-400 text-xs font-bold">
                  {trainer?.AreaofExpertise}
                </span>
              </section>
              <section className="flex items-center gap-x-4 mb-2">
                <span className="block text-sm font-bold">
                  {" "}
                  Experience Level
                </span>
                <span className="block text-gray-400 text-xs font-bold">
                  {trainer?.experienceLevel}
                </span>
              </section>
              <section className="flex items-center gap-x-4">
                <span className="block text-sm font-bold"> CV</span>
                <span className="block text-gray-400 text-sm font-bold  cursor-pointer hover:underline">
                  {trainer?.CvURL ? (
                    <a href={trainer?.CvURL}>Here</a>
                  ) : (
                    "Upload"
                  )}
                </span>
              </section>
            </div>
          </div>
          <div className="flex justify-end">
            <section
              className=" m-2 bg-gray-700 px-3 py-2 rounded text-center cursor-pointer hover:bg-gray-600 "
              onClick={() => setShowDeleteTrainer(true)}
            >
              Delete Trainer
            </section>
          </div>
        </section>
        <section className="flex-1 border border-gray-600 rounded">
          <div class="relative overflow-x-auto h-[394px] overflow-y-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <caption class="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                <div className="flex justify-between items-end">
                  <section>
                    Completed Projects
                    {/* <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Browse a list of your completed projects here
                    </p> */}
                  </section>
                  <section className="flex items-center justify-end">
                    <div className="relative mt-1 ">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="email"
                        id="topbar-search"
                        className="bg-gray-50  border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block  pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Title"
                        value={completedProjectTitle}
                        onChange={(e) => {
                          setCompletedProjectTitle(e.target.value);
                        }}
                      />
                    </div>
                  </section>
                </div>
              </caption>
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Project Title
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Location
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Priority
                  </th>

                  <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterCompletedProjects()?.map((project) => {
                  return (
                    <tr
                      key={project.id}
                      class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        class="px-6 py-4 font-bold text-gray-900  whitespace-nowrap dark:text-white"
                      >
                        {project.title}
                      </th>
                      <td class="px-6 py-4">{project.location}</td>
                      <td class="px-6 py-4 text-white font-bold">
                        {project.priority}
                      </td>

                      <td class="px-6 py-4 text-right">
                        <span
                          href="#"
                          class="font-medium text-white cursor-pointer  hover:underline"
                        >
                          Detail
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </section>
      <section className="mt-3 border border-gray-600 rounded">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg ">
          <div class="flex px-4 py-3 flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between ">
            <h1 className="font-semibold text-lg">Applied Projects</h1>
            <label for="table-search" class="sr-only">
              Search
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for projects"
                value={appliedProjectTitle}
                onChange={(e) => {
                  setAppliedProjectTitle(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="max-h-[375px] overflow-y-auto ">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Location
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Start Date
                  </th>
                  <th scope="col" class="px-6 py-3">
                    End Date
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Budget
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Priority
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filterAppliedProjects()?.map((project) => {
                  return (
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th
                        scope="row"
                        class="px-6 py-4  text-gray-900 font-bold whitespace-nowrap dark:text-white"
                      >
                        {project.title}
                      </th>
                      <td class="px-6 py-4">{project.location}</td>
                      <td class="px-6 py-4">{project.startDate}</td>
                      <td class="px-6 py-4">{project.endDate}</td>
                      <td class="px-6 py-4">{project.budget}</td>
                      <td class="px-6 py-4 text-white font-bold">
                        {project.priority}
                      </td>
                      <td class="px-6 py-4">{project.status}</td>
                      <td class="px-6 py-4">
                        <span
                          href="#"
                          class="font-medium text-white cursor-pointer  hover:underline"
                        >
                          Detail
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TrainerDetail;
