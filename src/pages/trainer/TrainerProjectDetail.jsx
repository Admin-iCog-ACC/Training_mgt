import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";

function TrainerProjectDetail() {
  let { id } = useParams();
  const [project, setProject] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [openApply, setOpenApply] = useState(false);
  const [description, setDescription] = useState("");
  const [applied, setApplied] = useState();
  const getProject = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/project/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res.data);
      setProject(res.data.project);
      setApplied(res.data.project.TrainersProjects[0] ? true : false);
    } catch (error) {
      console.log(error);
    }
  };
  const getTimeDifference = (timestampString) => {
    // if (!timestampString) return;
    const currentTime = new Date();
    const timestamp = new Date(timestampString);

    // Calculate the difference in milliseconds
    const difference = currentTime - timestamp;

    // Convert milliseconds to seconds, minutes, hours, days, and years
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (years) {
      return { date: years, unit: "yr" };
    } else if (days) {
      return { date: days, unit: "d" };
    } else if (hours) {
      return { date: hours, unit: "hr" };
    } else if (minutes) {
      return { date: minutes, unit: "min" };
    } else if (seconds) {
      return { date: seconds, unit: "sec" };
    } else {
      return {
        date: seconds,
        unit: "sec",
      };
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      setApplyLoading(true);
      const res = await axios.post(
        `http://localhost:3000/api/application`,
        { ProjectId: id, description: description },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      toast.success("Application successfully submitted!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,

        transition: Flip,
      });
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error("You have already applied for this project", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,

          transition: Flip,
        });
      } else if (error.response.status === 404) {
        toast.error("Project not found. Try again!", {
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
        toast.error("Operation failed try again!", {
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
    setApplyLoading(false);
    setOpenApply(false);
  };

  const getAppliedAt = (timeStamp) => {
    const date = new Date(timeStamp);

    return {
      day: date.getDay(),
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  };

  useEffect(() => {
    getProject();
  }, [id]);

  return (
    <>
      <div
        className={`${
          openApply ? "block" : "hidden"
        } absolute h-full w-full z-70 bottom-0 top-0 left-0  py-20 flex items-center justify-center`}
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="w-[600px] bg-white py-6 px-8 rounded">
          <div className="mt-2 mb-3 flex items-center justify-between">
            <h1 className="text-2xl  ">{project?.title}asdf</h1>
            <section
              className="w-10 h-10 flex items-center justify-center rounded cursor-pointer hover:bg-gray-100"
              onClick={() => setOpenApply(false)}
            >
              <svg
                className="w-4 h-4"
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
            </section>
          </div>
          <form onSubmit={handleApply} className="flex flex-col">
            <textarea
              name="description"
              id="description"
              cols="30"
              rows="10"
              className="border border-gray-400 p-2.5"
              placeholder="Why should we consider you for this project?"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className={`mt-3 text-[#168c9e] py-3 text-lg rounded hover:bg-gray-100 ${
                applyLoading ? "hidden" : "block"
              }`}
            >
              Submit
            </button>
            <section
              className={`${
                applyLoading ? "block" : "hidden"
              } text-[#168c9e] bg-gray-100 text-center text-lg py-3 mt-3 cursor-pointer`}
            >
              Submitting application....
            </section>
          </form>
        </div>
      </div>
      <div>
        <ToastContainer />
        <div class="md:flex no-wrap   mt-8   ">
          <div class="w-full md:w-9/12 mx-auto shadow-sm border bg-white  rounded ">
            <div class=" p-3 shadow-sm rounded-sm">
              <div class="flex items-center justify-between  space-x-2 font-semibold text-gray-900 leading-8 mb-3 px-4 ">
                <section className="flex items-center">
                  <img
                    class="h-14 w-14 rounded-lg cursor-pointer"
                    src={project?.imageURL}
                    alt=""
                  />
                  <span class="tracking-wide text-3xl text-[#168c9e] ml-2">
                    {project?.title}
                  </span>
                </section>
                <section className="font-normal text-[#168c9e]">
                  {getTimeDifference(project?.createdAt).date}
                  {getTimeDifference(project?.createdAt).unit}
                </section>
              </div>

              <div class="text-gray-700 my-8">
                <div class="grid md:grid-cols-2 text-base">
                  <div class="grid grid-cols-2">
                    <div class="px-4 py-2  font-semibold">Title</div>
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

                <div
                  className={`px-4 text-base mt-6 ${
                    project?.TrainersProjects[0]?.status === "Done"
                      ? "hidden"
                      : "block"
                  } `}
                >
                  {project?.description}
                </div>
                <div className="px-4 text-base mt-6">
                  <div className="flex justify-between">
                    <h1 className="text-2xl font-bold text-[#168c9e]">
                      Application -{" "}
                      <span
                        className={`${
                          project?.TrainersProjects[0]?.status === "Rejected" &&
                          "text-red-600"
                        }`}
                      >
                        {project?.TrainersProjects[0]?.status}
                      </span>
                    </h1>
                    <section
                      className={`text-[#168c93] ${
                        project?.TrainersProjects[0]?.status === "Done"
                          ? "hidden"
                          : "block"
                      }`}
                    >
                      {
                        getAppliedAt(project?.TrainersProjects[0]?.createdAt)
                          .day
                      }{" "}
                      /{" "}
                      {
                        getAppliedAt(project?.TrainersProjects[0]?.createdAt)
                          .month
                      }{" "}
                      /{" "}
                      {
                        getAppliedAt(project?.TrainersProjects[0]?.createdAt)
                          .year
                      }
                    </section>
                    <section
                      className={`flex ${
                        project?.TrainersProjects[0]?.Trainer
                          ?.TrainersRatings[0]
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      {
                        <>
                          {project?.TrainersProjects[0]?.Trainer
                            ?.TrainersRatings[0]?.rating === 0 && (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                            </>
                          )}
                          {project?.TrainersProjects[0]?.Trainer
                            ?.TrainersRatings[0]?.rating > 0 &&
                            project?.TrainersProjects[0]?.Trainer
                              ?.TrainersRatings[0]?.rating < 1 && (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="#888888"
                                    d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="#888888"
                                    d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="#888888"
                                    d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="#888888"
                                    d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                  />
                                </svg>
                              </>
                            )}
                          {project?.TrainersProjects[0]?.Trainer
                            ?.TrainersRatings[0]?.rating === 1 && (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                            </>
                          )}
                          {project?.TrainersProjects[0]?.Trainer
                            ?.TrainersRatings[0]?.rating > 1 &&
                            project?.TrainersProjects[0]?.Trainer
                              ?.TrainersRatings[0]?.rating < 2 && (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="#888888"
                                    d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="#888888"
                                    d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="#888888"
                                    d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                  />
                                </svg>
                              </>
                            )}
                          {project?.TrainersProjects[0]?.Trainer
                            ?.TrainersRatings[0]?.rating === 2 && (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>{" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                            </>
                          )}
                          {project?.TrainersProjects[0]?.Trainer
                            ?.TrainersRatings[0]?.rating > 2 &&
                            project?.TrainersProjects[0]?.Trainer
                              ?.TrainersRatings[0]?.rating < 3 && (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="#888888"
                                    d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="#888888"
                                    d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                  />
                                </svg>
                              </>
                            )}
                          {project?.TrainersProjects[0]?.Trainer
                            ?.TrainersRatings[0]?.rating === 3 && (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                            </>
                          )}
                          {project?.TrainersProjects[0]?.Trainer
                            ?.TrainersRatings[0]?.rating === 4 && (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#888888"
                                  d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                />
                              </svg>
                            </>
                          )}
                          {project?.TrainersProjects[0]?.Trainer
                            ?.TrainersRatings[0]?.rating === 5 && (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="orange"
                                  d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                />
                              </svg>
                            </>
                          )}
                          {project?.TrainersProjects[0]?.Trainer
                            ?.TrainersRatings[0]?.rating > 3 &&
                            project?.TrainersProjects[0]?.Trainer
                              ?.TrainersRatings[0]?.rating < 4 && (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="#888888"
                                    d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                  />
                                </svg>
                              </>
                            )}
                          {project?.TrainersProjects[0]?.Trainer
                            ?.TrainersRatings[0]?.rating > 4 &&
                            project?.TrainersProjects[0]?.Trainer
                              ?.TrainersRatings[0]?.rating < 5 && (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="orange"
                                    d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                  />
                                </svg>
                              </>
                            )}
                        </>
                      }
                    </section>
                    <section
                      className={`flex text-red-800 ${
                        !project?.TrainersProjects[0]?.Trainer
                          ?.TrainersRatings[0] &&
                        project?.TrainersProjects[0]?.status === "Done"
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      Rating not given yet
                    </section>
                  </div>
                  <div
                    className={`flex mt-4 text-lg ${
                      project?.TrainersProjects[0]?.status === "Done"
                        ? "block"
                        : "hidden"
                    }`}
                  >
                    {
                      project?.TrainersProjects[0]?.Trainer?.TrainersRatings[0]
                        ?.ratingRationale
                    }
                  </div>
                  <div
                    className={`flex mt-4 text-lg ${
                      !project?.TrainersProjects[0]?.Trainer?.TrainersRatings[0]
                        ? "block"
                        : "hidden"
                    }`}
                  >
                    {project?.TrainersProjects[0]?.description}
                  </div>
                </div>
              </div>
              <div className="flex">
                <button
                  onClick={() => setOpenApply(true)}
                  class={`${
                    applied ? "hidden" : "block"
                  }  w-full  text-[#168c9e] text-base font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4`}
                >
                  Apply Here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrainerProjectDetail;
