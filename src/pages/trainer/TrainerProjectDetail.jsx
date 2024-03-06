import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";

function TrainerProjectDetail() {
  let { id } = useParams();
  const [project, setProject] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);

  const getProject = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/project/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res.data.project);
      setProject(res.data.project);
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

  const handleApply = async () => {
    try {
      const result = window.confirm(
        "Are you sure uou want to apply for this project?"
      );
      console.log(result);
      if (!result) return;
      setApplyLoading(true);
      const res = await axios.post(
        `http://localhost:3000/api/application`,
        { ProjectId: id },
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
  };

  useEffect(() => {
    getProject();
  }, [id]);

  return (
    <div>
      <ToastContainer />
      <div class="md:flex no-wrap md:-mx-2  mt-8  ">
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
              <div className="px-4 text-base mt-6 ">{project?.description}</div>
            </div>
            <div className="flex">
              <button
                onClick={() => handleApply()}
                class="block w-full  text-[#168c9e] text-base font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
              >
                {applyLoading ? "Applying..." : "Apply Here"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainerProjectDetail;
