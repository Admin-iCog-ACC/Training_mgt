import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProjectDetail() {
  let { id } = useParams();
  const [project, setProject] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [toBeDeleted, setToBeDeleted] = useState(null);
  const [updateProject, setUpdateProject] = useState(null);
  const [trainerDeleteLoading, setTrainerDeleteLoading] = useState(false);
  const [trainerUpdateLoading, setTrainerUpdateLoading] = useState(false);
  const searchTrainers = () => {
    return project?.Trainers?.filter((trainer) =>
      trainer.email.toLowerCase().startsWith(searchEmail.toLowerCase().trim())
    );
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/project/${id}`,
        updateProject,
        {
          headers: {
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWRtaW4iOnRydWUsImVtYWlsIjoiYXJzZW5hbGd1bm5lcjYzMjZAZ21haWwuY29tIiwiaWF0IjoxNzA2ODAxMTQ2fQ.iBqM6CbSQtS7rDQfzLbVUf0FdkPqx3JKDXpet1LbEks",
          },
        }
      );
      setProject(updateProject);
      console.log(project?.budget);

      setUpdateProject(null);
      toast.success("Project successfully updated!", {
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
      console.log(error);
    }
  };
  const deleteTrainer = async () => {
    setTrainerDeleteLoading(true);
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/application/${toBeDeleted?.id}/${id}`,
        {
          headers: {
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWRtaW4iOnRydWUsImVtYWlsIjoiYXJzZW5hbGd1bm5lcjYzMjZAZ21haWwuY29tIiwiaWF0IjoxNzA2ODAxMTQ2fQ.iBqM6CbSQtS7rDQfzLbVUf0FdkPqx3JKDXpet1LbEks",
          },
        }
      );
      console.log(res);

      // await axios.delete(
      //   `http://localhost:3000/api/deleteFile/${toBeDeleted?.profileImageId}`,
      //   {
      //     headers: {
      //       authorization:
      //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWRtaW4iOnRydWUsImVtYWlsIjoiYXJzZW5hbGd1bm5lcjYzMjZAZ21haWwuY29tIiwiaWF0IjoxNzA2ODAxMTQ2fQ.iBqM6CbSQtS7rDQfzLbVUf0FdkPqx3JKDXpet1LbEks",
      //     },
      //   }
      // );
      toast.success("Trainer successfully removed!", {
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
      setProject({
        ...project,
        Trainers: project?.Trainers.filter(
          (trainer) => trainer.id !== toBeDeleted.id
        ),
      });
      setToBeDeleted(null);
    } catch (error) {
      toast.error("Operation unsuccessful. Please try again!", {
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
      console.log(error);
    }
    setTrainerDeleteLoading(false);
  };
  const getProject = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/project/${id}`, {
        headers: {
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWRtaW4iOnRydWUsImVtYWlsIjoiYXJzZW5hbGd1bm5lcjYzMjZAZ21haWwuY29tIiwiaWF0IjoxNzA2ODAxMTQ2fQ.iBqM6CbSQtS7rDQfzLbVUf0FdkPqx3JKDXpet1LbEks",
        },
      });
      console.log(res.data.project);
      setProject(res.data.project);
    } catch (error) {
      console.log(error);
    }
  };

  const getTimeDifference = (createdAt) => {
    //   t, (_ = time.Parse(time.RFC3339, createdAt));
    if (!createdAt) {
      return null;
    }
    const inputDate = new Date(createdAt);

    // Get the current date
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = currentDate - inputDate;

    // Calculate the difference in days
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // Format the inputDate in the desired format "Nov 07, 2016"
    const formattedInputDate = inputDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return formattedInputDate;
  };

  const handleUpdateProjectChange = (e) => {
    const { name, value } = e.target;
    setUpdateProject((prev) => {
      return { ...prev, [name]: value };
    });
    console.log(name, value);
  };

  useEffect(() => {
    getProject();
  }, [id]);

  return (
    <>
      <div
        id="crud-modal"
        tabindex="-1"
        aria-hidden="true"
        style={{ background: "rgba(0,0,0,0.6)" }}
        class={`flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
          updateProject ? "block" : "hidden"
        }`}
      >
        <div class="relative  w-full max-w-2xl max-h-full ">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Update Project
              </h3>
              <button
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
                onClick={() => setUpdateProject(null)}
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
                <span class="sr-only">Close modal</span>
              </button>
            </div>

            <form class="p-4 md:p-5" onSubmit={handleUpdateProject}>
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2">
                  <label
                    for="title"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type product name"
                    required
                    value={updateProject?.title}
                    onChange={handleUpdateProjectChange}
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="location"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="country"
                    required
                    onChange={handleUpdateProjectChange}
                    value={updateProject?.location}
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="status"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={updateProject?.status}
                    onChange={handleUpdateProjectChange}
                    name="status"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="location"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="startDate"
                    required
                    onChange={handleUpdateProjectChange}
                    value={updateProject?.startDate}
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="status"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="End Date"
                    required
                    onChange={handleUpdateProjectChange}
                    value={updateProject?.endDate}
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="location"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Budget
                  </label>
                  <input
                    type="text"
                    name="budget"
                    id="budget"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Budget"
                    required
                    onChange={handleUpdateProjectChange}
                    value={updateProject?.budget}
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="status"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Priority
                  </label>

                  <select
                    id="status"
                    value={updateProject?.priority}
                    onChange={handleUpdateProjectChange}
                    name="priority"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="High">High</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div class="col-span-2">
                  <label
                    for="overview"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Project Overview
                  </label>
                  <textarea
                    id="overview"
                    rows="4"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Project overview"
                    value={updateProject?.overview}
                    onChange={handleUpdateProjectChange}
                    name="overview"
                  ></textarea>
                </div>
                <div class="col-span-2">
                  <label
                    for="overview"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Project Description
                  </label>
                  <textarea
                    id="overview"
                    rows="4"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Project description"
                    value={updateProject?.description}
                    name="description"
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                class="text-white inline-flex items-center bg-gray-800 px-4 py-2 rounded hover:bg-gray-900"
              >
                {!trainerUpdateLoading && "Save project"}
                <div
                  role="status"
                  className={`text-white flex  justify-center items-center gap-x-1 ${
                    trainerUpdateLoading ? "block" : "hidden"
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
                  <span>Updating...</span>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
      <div
        id="popup-modal"
        tabindex="-1"
        style={{ background: "rgba(0,0,0,0.6)" }}
        class={`flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
          toBeDeleted ? "block" : "hidden"
        }`}
      >
        <div class="relative p-4 w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
              onClick={() => setToBeDeleted(null)}
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
              <span class="sr-only">Close modal</span>
            </button>
            {console.log(toBeDeleted?.profileImage)}
            <div class="p-4 md:p-5 text-center">
              <img
                src={toBeDeleted?.profileImage}
                alt={toBeDeleted?.firstName}
                className="w-12 h-12 rounded-full mx-auto mb-4 bg-red-900"
              />
              <section className="text-lg font-bold">
                {toBeDeleted?.firstName} {toBeDeleted?.lastName}
              </section>
              <section className="text-sm text-gray-300">
                {toBeDeleted?.email}
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
                  {!trainerDeleteLoading && "Yes, I'm sure"}
                  <div
                    role="status"
                    className={`text-white flex  justify-center items-center gap-x-1 ${
                      trainerDeleteLoading ? "block" : "hidden"
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
                  onClick={() => setToBeDeleted(null)}
                  class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md:flex no-wrap md:-mx-2 ">
        <div class="w-full md:w-9/12 mx-2 ">
          <div class="bg-white p-3 shadow-sm rounded-sm">
            <div class="flex justify-start items-center  space-x-2 font-semibold text-gray-900 leading-8 mb-3 px-4 cursor-pointer">
              <img
                class="h-14 w-14 rounded-lg"
                src={project?.imageURL}
                alt=""
              />
              <span class="tracking-wide text-3xl">{project?.title}</span>
            </div>
            <div class="text-gray-700">
              <div class="grid md:grid-cols-2 text-sm">
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Title</div>
                  <div class="px-4 py-2">{project?.title}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Location</div>
                  <div class="px-4 py-2">{project?.location}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Start Date</div>
                  <div class="px-4 py-2">{project?.startDate}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">End Date </div>
                  <div class="px-4 py-2">{project?.endDate}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Budget</div>
                  <div class="px-4 py-2">{project?.budget}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Span</div>
                  <div class="px-4 py-2">{project?.span}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Status</div>
                  <div class="px-4 py-2">{project?.status}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Priority</div>
                  <div class="px-4 py-2">{project?.priority}</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setUpdateProject(project)}
              class="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
            >
              Show Full Information
            </button>
          </div>
        </div>
        <div class="w-full md:w-3/12 md:mx-2">
          <div class="bg-white p-3 border-t-4 border-green-400">
            <h1 class="text-gray-900 font-bold text-xl leading-8 my-1">
              <img
                class={`h-16 w-16 rounded-full mx-auto ${
                  !project?.Admin?.imageURL && "hidden"
                }`}
                src={project?.Admin?.imageURL}
                alt=""
              />{" "}
              <svg
                viewBox="0 0 512 512"
                fill="currentColor"
                height="1em"
                width="1em"
                className={`h-16 w-16 rounded-full mx-auto ${
                  project?.Admin?.imageURL ? "hidden" : "block"
                }`}
              >
                <path d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 01-6.14-.32 124.27 124.27 0 00-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 00-32.35 29.58 4 4 0 01-6.14.32A175.32 175.32 0 0180 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 01-46.68 119.25z" />
                <path d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z" />
              </svg>
              {/* {console.log(project?.Admin?.imageURL)} */}
              {project?.Admin?.firstName} {project?.Admin?.lastName}
            </h1>
            <h3 class="text-gray-600 font-lg text-semibold leading-6">
              {project?.Admin?.email}
            </h3>

            <ul class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
              <li class="flex items-center py-3">
                <span>Status</span>
                <span class="ml-auto">
                  <span class="bg-green-500 py-1 px-2 rounded text-white text-sm">
                    Active
                  </span>
                </span>
              </li>
              <li class="flex items-center py-3">
                <span>Member since</span>
                <span class="ml-auto">
                  {getTimeDifference(project?.Admin?.createdAt)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="my-4"></div>
      <div class="flex flex-col">
        <div class="sm:flex mb-3 ">
          <div class="items-center hidden sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
            <form class="lg:pr-3  w-full" action="#" method="GET">
              <div class="items-center justify-between relative mt-1 lg:w-64 xl:w-96">
                <input
                  type="text"
                  name="email"
                  id="users-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search for trainers"
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
                <span className="text-sm">
                  {searchTrainers()?.length} item
                  {searchTrainers()?.length > 1 ? "s" : null}
                </span>
              </div>
            </form>
          </div>
        </div>
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-y-auto  h-[400px]">
              <table class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead class="bg-gray-700 ">
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
                      class="p-4 text-xs text-center font-medium  text-gray-500 uppercase dark:text-gray-400"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class=" divide-y divide-gray-200   dark:bg-gray-800 dark:divide-gray-700">
                  {searchTrainers(project?.Trainers)?.map((trainer) => {
                    return (
                      <tr
                        key={trainer.id}
                        class="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td class="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
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
                        <td class="p-4  whitespace-nowrap ">
                          <div className="flex justify-center gap-x-4">
                            <button
                              type="button"
                              data-modal-toggle="delete-user-modal"
                              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                              onClick={() => setToBeDeleted(trainer)}
                            >
                              <svg
                                class="w-4 h-4 mr-2"
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
                              Delete trainer
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
    </>
  );
}

export default ProjectDetail;
