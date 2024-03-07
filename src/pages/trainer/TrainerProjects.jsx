import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState(null);
  const [stats, setStats] = useState(null);
  let [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState({
    title: "",
    priority: "",
    status: "",
    start: "",
    end: "",
    location: "",
  });
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    const sp = new URLSearchParams(searchParams);
    sp.delete(name);
    sp.append(name, value);
    setSearchParams(sp);
  };
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/project", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res.data);
      setProjects(res.data.projects);
      setStats(res.data.stat);
    } catch (error) {
      console.log(error);
    }
  };

  const filterProjects = (projects) => {
    const { title, priority, status, start, end, location } = search;
    const filteredProjects = projects?.filter(
      (project) =>
        project.title
          .toLowerCase()
          .startsWith(
            searchParams.get("title")
              ? searchParams.get("title").toLowerCase().trim()
              : ""
          ) &&
        project.startDate
          .toLowerCase()
          .startsWith(
            searchParams.get("start") ? searchParams.get("start").trim() : ""
          ) &&
        project.endDate
          .toLowerCase()
          .startsWith(
            searchParams.get("end")
              ? searchParams.get("end").toLowerCase().trim()
              : ""
          ) &&
        (project.TrainersProjects[0]
          ? project.TrainersProjects[0].status
              .toLowerCase()
              .startsWith(
                searchParams.get("status")
                  ? searchParams.get("status").toLowerCase().trim()
                  : ""
              )
          : searchParams.get("status")
          ? false
          : true) &&
        project.priority
          .toLowerCase()
          .startsWith(
            searchParams.get("priority")
              ? searchParams.get("priority").toLowerCase().trim()
              : ""
          ) &&
        project.location
          .toLowerCase()
          .startsWith(
            searchParams.get("location")
              ? searchParams.get("location").toLowerCase().trim()
              : ""
          )
    );

    return filteredProjects;
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <div className="">
      <div class="px-4 relative mx-auto text-gray-600   mt-3 mb-6">
        <h1 className=" font-bold text-2xl">
          Discover Engaging Projects and Apply as a Trainer Today!
        </h1>
        <section className="mt-2 flex items-start justify-between relative">
          <div className="absolute top-3 left-0  flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="#168c9e"
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
          <div className="">
            <input
              className="border-2 border-gray-300 text-gray-700 h-10 pl-9 rounded-lg text-base focus:outline-none"
              type="text"
              name="title"
              placeholder="title"
              onChange={(e) => handleSearchChange(e)}
              value={searchParams.get("title") ? searchParams.get("title") : ""}
            />
            <div className="flex items-end gap-x-4">
              <section>{filterProjects(projects)?.length} found</section>
              <section
                className={`cursor-pointer mt-1 hover:text-[#168c9e] ${
                  searchParams.get("title")?.trim() ||
                  searchParams.get("priority")?.trim() ||
                  searchParams.get("status")?.trim() ||
                  searchParams.get("start")?.trim() ||
                  searchParams.get("location")?.trim() ||
                  searchParams.get("end")?.trim()
                    ? "inline"
                    : "hidden"
                }`}
                onClick={() => {
                  setSearch({
                    title: "",
                    priority: "",
                    status: "",
                    start: "",
                    end: "",
                    location: "",
                  });
                  setSearchParams({});
                }}
              >
                Clear search
              </section>
            </div>
          </div>
          <button
            onClick={() => {
              const sp = new URLSearchParams(searchParams);
              sp.delete("filter");
              sp.append("filter", true);
              setSearchParams(sp);
            }}
            className={`  group flex gap-x-4 items-center text-[#168c9e] text-lg tracking-wide transition ease-in-out duration-100  px-4 py-1 rounded-xl cursor-pointer   hover:bg-[#168c9e] hover:font-bold hover:text-white`}
          >
            Filters
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              className="block group-hover:hidden"
            >
              <path
                fill="#168c9e"
                d="M11.058 17q-.213 0-.357-.144q-.143-.144-.143-.357q0-.212.143-.356q.144-.143.357-.143h1.865q.213 0 .356.144t.144.357q0 .212-.144.356q-.143.143-.356.143zm-3.75-4.5q-.213 0-.357-.144q-.143-.144-.143-.357t.143-.356q.144-.143.357-.143h9.365q.213 0 .356.144q.144.144.144.357t-.144.356q-.143.143-.356.143zM4.5 8q-.213 0-.356-.144T4 7.499q0-.212.144-.356Q4.288 7 4.5 7h15q.213 0 .356.144q.144.144.144.357q0 .212-.144.356Q19.713 8 19.5 8z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              className="hidden group-hover:block"
            >
              <path
                fill="white"
                d="M11.058 17q-.213 0-.357-.144q-.143-.144-.143-.357q0-.212.143-.356q.144-.143.357-.143h1.865q.213 0 .356.144t.144.357q0 .212-.144.356q-.143.143-.356.143zm-3.75-4.5q-.213 0-.357-.144q-.143-.144-.143-.357t.143-.356q.144-.143.357-.143h9.365q.213 0 .356.144q.144.144.144.357t-.144.356q-.143.143-.356.143zM4.5 8q-.213 0-.356-.144T4 7.499q0-.212.144-.356Q4.288 7 4.5 7h15q.213 0 .356.144q.144.144.144.357q0 .212-.144.356Q19.713 8 19.5 8z"
              />
            </svg>
          </button>
          {/* <section className="flex gap-x-4 items-center">
            <section>
              <label htmlFor="start" className=" text-sm">
                Start:{" "}
              </label>
              <input
                className="border-2 border-gray-300 text-gray-700  h-10 px-5 pr-16 rounded-lg text-base focus:outline-none"
                type="date"
                name="start"
                onChange={handleSearchChange}
              />
            </section>
            <span className="text-gray-900 font-medium">to</span>
            <section>
              <label htmlFor="start" className=" text-sm">
                end:{" "}
              </label>
              <input
                className="border-2 border-gray-300 text-gray-700  h-10 px-5 pr-16 rounded-lg text-base focus:outline-none"
                type="date"
                name="end"
                onChange={handleSearchChange}
              />
            </section>
          </section> */}
        </section>
        <section className="flex items-center gap-x-6 mt-3">
          <div
            className={`cursor-pointer px-5 py-3  rounded-lg ${
              !searchParams.get("status")
                ? "bg-[#168c9e] hover:bg-[#1badc4] text-white font-bold"
                : "hover:bg-white bg-gray-400 text-white hover:text-[#168c9e]"
            }`}
            onClick={() => {
              const sp = new URLSearchParams(searchParams);
              sp.delete("status");
              setSearchParams(sp);
            }}
          >
            All ({projects?.length})
          </div>
          <div
            className={`cursor-pointer px-5 py-3  rounded-lg ${
              searchParams.get("status") === "Done"
                ? "bg-[#168c9e] hover:bg-[#1badc4] text-white font-bold"
                : "hover:bg-white bg-gray-400 text-white hover:text-[#168c9e]"
            }`}
            onClick={() => {
              const sp = new URLSearchParams(searchParams);
              sp.delete("status");
              sp.append("status", "Done");
              setSearchParams(sp);
            }}
          >
            Completed ({stats?.completed})
          </div>
          <div
            className={`cursor-pointer px-5 py-3  rounded-lg ${
              searchParams.get("status") === "In Progress"
                ? "bg-[#168c9e] hover:bg-[#1badc4] text-white font-bold"
                : "hover:bg-white bg-gray-400 text-white hover:text-[#168c9e]"
            }`}
            onClick={() => {
              const sp = new URLSearchParams(searchParams);
              sp.delete("status");
              sp.append("status", "In Progress");
              setSearchParams(sp);
            }}
          >
            In-Progress ({stats?.inProgress})
          </div>
          <div
            className={`cursor-pointer px-5 py-3  rounded-lg ${
              searchParams.get("status") === "Rejected"
                ? "bg-[#168c9e] hover:bg-[#1badc4] text-white font-bold"
                : "hover:bg-white bg-gray-400 text-white hover:text-[#168c9e]"
            }`}
            onClick={() => {
              const sp = new URLSearchParams(searchParams);
              sp.delete("status");
              sp.append("status", "Rejected");
              setSearchParams(sp);
            }}
          >
            Rejected ({stats?.rejected})
          </div>
        </section>
      </div>
      <div className="grid grid-cols-4   gap-y-8 justify-items-center ">
        {filterProjects(projects)?.map((project) => {
          return (
            <section
              key={project.id}
              className="bg-white group text-gray-500 hover:text-gray-900 hover:shadow-lg w-[450px] rounded-lg transition  group  hover:-translate-y-2"
            >
              <img
                src={`${project.imageURL}`}
                className=" w-full h-[250px] rounded-t-md mb-2 "
                alt=""
              />
              <section className="px-3 mb-3">
                <section className="flex justify-between items-center">
                  <h1 className={` font-bold text-2xl`}>{project.title}</h1>
                  <section className="text-[#21c2db] group-hover:text-[#168c9e] group-hover:font-bold">
                    {project.priority}
                  </section>
                </section>
                <section className="text-sm">
                  <span className="text-gray-900 mr-2">Start Date:</span>
                  <span className="text-[#21c2db] group-hover:text-[#168c9e] group-hover:font-bold">
                    {project.startDate}
                  </span>{" "}
                </section>
                <section className="text-sm ">
                  <span className="text-gray-900 mr-2">End Date:</span>
                  <span className="text-[#21c2db] group-hover:text-[#168c9e] group-hover:font-bold">
                    {project.endDate}
                  </span>{" "}
                </section>
                <section className={`text-sm`}>
                  <span className="text-gray-900 mr-2">
                    Application Status:
                  </span>
                  <span
                    className={`  ${
                      project.TrainersProjects[0]
                        ? "text-[#168c9e]"
                        : "text-gray-400"
                    } ${searchParams.get("status") ? "font-bold" : ""}`}
                  >
                    {project.TrainersProjects[0]
                      ? project.TrainersProjects[0].status
                      : "No Application"}
                  </span>{" "}
                </section>
                <section
                  className={`${search.location ? "block" : "hidden"} text-sm`}
                >
                  <span className="text-gray-900 mr-2">Location:</span>
                  <span className="text-[#21c2db] group-hover:text-[#168c9e] group-hover:font-bold">
                    {project.location}
                  </span>{" "}
                </section>
              </section>
              <section className="px-1 ">
                <p className="text-base  text-center  duration-200 ease-out ">
                  {project.overview}
                </p>
              </section>
              <section className="text-center my-3 font-bold text-lg tracking-wide ">
                <span
                  className=" text-sm text-[#21c2db] hover:text-[#168c9e] hover:underline cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  Detail Here
                </span>
              </section>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default Projects;
