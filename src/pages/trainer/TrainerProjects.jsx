import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState(null);

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

    console.log(name, value);
    setSearch((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
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
    } catch (error) {
      console.log(error);
    }
  };

  const filterProjects = (projects) => {
    const { title, priority, status, start, end, location } = search;
    const filteredProjects = projects?.filter(
      (project) =>
        project.title.toLowerCase().startsWith(title.toLowerCase().trim()) &&
        project.startDate
          .toLowerCase()
          .startsWith(start.toLowerCase().trim()) &&
        project.endDate.toLowerCase().startsWith(end.toLowerCase().trim()) &&
        project.status.toLowerCase().startsWith(status.toLowerCase().trim()) &&
        project.priority
          .toLowerCase()
          .startsWith(priority.toLowerCase().trim()) &&
        project.location.toLowerCase().startsWith(location.toLowerCase().trim())
    );

    return filteredProjects;
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <div className="">
      <div class="px-4 relative mx-auto text-gray-600 mb-2  py-6">
        <h1 className=" font-bold text-2xl">
          Discover Engaging Projects and Apply as a Trainer Today!
        </h1>
        <section className="mb-3 mt-5 flex items-center justify-between">
          <input
            className="border-2 border-gray-300 text-gray-700  h-10 px-5 pr-16 rounded-lg text-base focus:outline-none"
            type="text"
            name="title"
            placeholder="title"
            onChange={(e) => handleSearchChange(e)}
            value={search.title}
          />
          <section className="flex gap-x-4 items-center">
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
          </section>
        </section>
        <div className="flex justify-between">
          <section>
            <select
              onChange={handleSearchChange}
              name="priority"
              id="status"
              className="border-2 mr-4 border-gray-300 text-gray-700  h-10 px-5 pr-16 rounded-lg text-base focus:outline-none"
            >
              <option value="">Filter by priority </option>
              <option value="Low">Low</option>
              <option value="High">High</option>
              <option value="Intermediate">Intermediate</option>
            </select>
            <input
              className="border-2 w-60 border-gray-300 text-gray-700  h-10 px-5 pr-16 rounded-lg text-base focus:outline-none"
              type="text"
              name="location"
              placeholder="location"
              onChange={handleSearchChange}
            />
          </section>

          <section>{filterProjects(projects)?.length} found</section>
        </div>
        <section
          className={`cursor-pointer mt-1 hover:text-gray-900 ${
            search.title.trim() ||
            search.priority.trim() ||
            search.status.trim() ||
            search.start.trim() ||
            search.location.trim() ||
            search.end.trim()
              ? "inline"
              : "hidden"
          }`}
          onClick={() =>
            setSearch({
              title: "",
              priority: "",
              status: "",
              start: "",
              end: "",
              location: "",
            })
          }
        >
          Clear search
        </section>
      </div>
      <div className="grid grid-cols-4 py-2  gap-y-8 justify-items-center ">
        {filterProjects(projects)?.map((project) => {
          return (
            <section
              key={project.id}
              className="bg-gray-100  text-gray-500 hover:text-gray-900 hover:bg-gray-200 w-[450px] rounded-lg transition shadow-md group hover:shadow-none hover:-translate-y-2"
            >
              <img
                src={`${project.imageURL}`}
                className=" w-full h-[250px] rounded-md mb-2 "
                alt=""
              />
              <section className="px-3 mb-3">
                <section className="flex justify-between items-center">
                  <h1 className={` font-bold text-2xl`}>{project.title}</h1>
                  <section>{project.priority}</section>
                </section>
                <section className="text-base">
                  <span className="text-gray-900 mr-2">Start Date:</span>
                  <span className="font-bold">{project.startDate}</span>{" "}
                </section>
                <section className="text-sm ">
                  <span className="text-gray-900 mr-2">End Date:</span>
                  <span className="font-bold">{project.endDate}</span>{" "}
                </section>
                <section
                  className={`${search.location ? "block" : "hidden"} text-sm`}
                >
                  <span className="text-gray-900 mr-2">Location:</span>
                  <span className={`font-bold`}>{project.location}</span>{" "}
                </section>
              </section>
              <section className="px-1 ">
                <p className="text-base  text-center  duration-200 ease-out ">
                  {project.overview}
                </p>
              </section>
              <section className="text-center my-3 font-bold text-lg tracking-wide ">
                <span
                  className="hover:text-gray-500 cursor-pointer"
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
