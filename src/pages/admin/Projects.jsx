import { Translate } from "@material-ui/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState(null);
  const [display, setDisplay] = useState("other");
  const { showDrawer } = useOutletContext();
  const navigate = useNavigate();

  const [search, setSearch] = useState({
    title: "",
    priority: "",
    status: "",
    start: "",
    end: "",
  });

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
    const { title, priority, status, start, end } = search;
    const filteredProjects = projects?.filter(
      (project) =>
        project.title.toLowerCase().startsWith(title.toLowerCase().trim()) &&
        project.startDate
          .toLowerCase()
          .startsWith(start.toLowerCase().trim()) &&
        project.endDate.toLowerCase().startsWith(end.toLowerCase().trim()) &&
        project.status.toLowerCase().startsWith(status.toLowerCase().trim()) &&
        project.priority.toLowerCase().startsWith(priority.toLowerCase().trim())
    );

    return filteredProjects;
  };

  useEffect(() => {
    fetchProjects();
  }, [showDrawer]);

  return (
    <div>
      {/* <div onClick={() => setShowDrawer(true)}>show</div> */}
      {/* <div
        className={` top-0 right-0 z-40 h-screen  overflow-y-auto transition-transform   w-full ${
          showDrawer ? "fixed" : "hidden"
        }`}
        style={{ background: "rgba(0,0,0,0.2)" }}
      > */}

      {/* </div> */}
      <div className="flex justify-between items-start">
        <form action="#" method="GET" className="hidden lg:block ">
          <div className="relative mt-1 lg:w-96">
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
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Title"
              value={search.title}
              onChange={(e) => {
                setSearch((prev) => {
                  return { ...prev, title: e.target.value };
                });
              }}
            />
          </div>
          <span className="tex-sm text-gray-400">
            {`${filterProjects(projects)?.length} found`}
          </span>
          <span
            onClick={() =>
              setSearch({
                title: "",
                priority: "",
                status: "",
                start: "",
                end: "",
              })
            }
            className={`tex-sm text-gray-400 transition transform duration-75 ml-4 cursor-pointer hover:underline hover:text-white ${
              search.title.trim() ||
              search.priority.trim() ||
              search.status.trim() ||
              search.start.trim() ||
              search.end.trim()
                ? "inline"
                : "hidden"
            }`}
          >
            Clear search
          </span>
        </form>
        <section>
          <div
            className="bg-gray-700 py-2 px-3 hover:bg-gray-600 cursor-pointer rounded "
            onClick={() =>
              setDisplay((prev) => {
                if (prev == "other") {
                  return "table";
                }
                return "other";
              })
            }
          >
            Change Display
          </div>
        </section>
      </div>
      <section
        className={`text-white flex  items-center justify-between mt-6 ${
          display != "other" && "hidden"
        }`}
      >
        <section className="flex gap-x-3">
          <select
            id="countries"
            onChange={(e) => {
              setSearch((prev) => {
                return { ...prev, priority: e.target.value };
              });
            }}
            value={search.priority}
            className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:hover:bg-gray-800"
          >
            <option value="">Filter by priority...</option>
            <option value="High">High</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Low">Low</option>
          </select>
          <select
            id="countries"
            onChange={(e) => {
              setSearch((prev) => {
                return { ...prev, status: e.target.value };
              });
            }}
            value={search.status}
            className="bg-gray-500  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:hover:bg-gray-800"
          >
            <option value="">Filter by status...</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </section>

        <section className="flex gap-x-2 items-center">
          <label htmlFor="start" className="text-gray-400 text-sm">
            Start:{" "}
          </label>

          <input
            type="date"
            placeholder="start date"
            className="text-white bg-gray-700 p-2"
            id="start"
            onChange={(e) => {
              setSearch((prev) => {
                return { ...prev, start: e.target.value };
              });
            }}
            value={search.start}
          />
          <span>to</span>
          <label htmlFor="end" className="text-gray-400 text-sm">
            End:{" "}
          </label>

          <input
            type="date"
            placeholder="end date"
            className="text-white bg-gray-700 p-2"
            id="end"
            onChange={(e) => {
              setSearch((prev) => {
                return { ...prev, end: e.target.value };
              });
            }}
            value={search.end}
          />
        </section>
      </section>
      <div
        className={`grid grid-cols-1 py-2 gap-x-4 gap-y-4  sm:grid-cols-2 sm:gap-x-8 xl:grid-cols-4 mt-4 h-[730px] overflow-y-auto ${
          display != "other" && "hidden"
        }`}
      >
        {filterProjects(projects)?.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/admin/project/detail/${project.id}`)}
            className={`text-gray-900 rounded   max-h-[370px]     bg-gray-400    ${
              project.status === "Completed"
                ? ""
                : "transition  transform hover:bg-white hover:-translate-y-2 hover:border hover:border-white cursor-pointer"
            }`}
          >
            <section className="flex justify-center w-full h-[230px] rounded relative">
              <section
                className={`${
                  project.status === "Completed" ? "visible" : "hidden"
                }`}
              >
                <div class="absolute inset-0 bg-black opacity-70"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <p class="text-white text-2xl font-bold">Completed</p>
                </div>
              </section>
              <img
                src={project.imageURL}
                className={`w-full h-full rounded`}
                alt=""
              />
            </section>
            <section className="px-3 py-3">
              <span className={` font-bold text-2xl `}>{project.title}</span>
              <section className="text-base">
                <span className="text-gray-900 mr-2">Start Date:</span>
                <span className="font-bold">{project.startDate}</span>{" "}
              </section>
              <section className="text-sm">
                <span className="text-gray-900 mr-2">End Date:</span>
                <span className="font-bold">{project.endDate}</span>{" "}
              </section>
              <section className="text-sm">
                <span className="text-gray-900 mr-2">Status:</span>
                <span className="font-bold">{project.status}</span>{" "}
              </section>
              <section className="text-sm">
                <span className="text-gray-900 mr-2">Priority:</span>
                <span className="font-bold">{project.priority}</span>{" "}
              </section>
              {/* <p className="text-center text-sm text-gray-600 mt-2">
                {project.overview.length > 360
                  ? `${project.overview.slice(0, 360)}...`
                  : project.overview}
              </p> */}
            </section>
          </div>
        ))}
      </div>
      <div
        className={`border border-gray-500 px-5 py-6 mt-4 rounded-lg  ${
          display == "table" ? "block" : "hidden"
        }`}
      >
        <div className="items-center justify-between lg:flex">
          <div className="mb-4 lg:mb-0">
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Projects
            </h3>
            <span className="text-base font-normal text-gray-500 dark:text-gray-400">
              This is a list of latest projects
            </span>
          </div>
          <div className="items-center sm:flex">
            <div className="flex items-center">
              <select
                onChange={(e) => {
                  setSearch((prev) => {
                    return { ...prev, priority: e.target.value };
                  });
                }}
                name="status"
                id="status"
                value={search.priority}
                className="mb-4 sm:mb-0 mr-4 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                <option value="">Filter by priority </option>
                <option value="Low">Low</option>
                <option value="High">High</option>
                <option value="Intermediate">Intermediate</option>
              </select>
              <select
                onChange={(e) => {
                  setSearch((prev) => {
                    return { ...prev, status: e.target.value };
                  });
                }}
                name="status"
                id="status"
                value={search.status}
                className="mb-4 sm:mb-0 mr-12 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                <option value="">Filter by status</option>

                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <section className="flex gap-x-2 items-center">
                <label htmlFor="start" className="text-gray-400 text-sm">
                  Start:{" "}
                </label>

                <input
                  type="date"
                  placeholder="start date"
                  className="text-white bg-gray-700 p-2"
                  id="start"
                  onChange={(e) => {
                    setSearch((prev) => {
                      return { ...prev, start: e.target.value };
                    });
                  }}
                />
                <span>to</span>
                <label htmlFor="start" className="text-gray-400 text-sm">
                  End:{" "}
                </label>

                <input
                  type="date"
                  placeholder="start date"
                  className="text-white bg-gray-700 p-2"
                  id="start"
                  onChange={(e) => {
                    setSearch((prev) => {
                      return { ...prev, end: e.target.value };
                    });
                  }}
                />
              </section>
              <div
                id="dropdown"
                className="z-10 w-56 p-3 bg-white rounded-lg shadow absolute m-0  dark:bg-gray-700 hidden"
                data-popper-placement="bottom"
              >
                <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                  Category
                </h6>
                <ul
                  className="space-y-2 text-sm"
                  aria-labelledby="dropdownDefault"
                >
                  <li className="flex items-center">
                    <input
                      id="apple"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />

                    <label
                      for="apple"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Completed (56)
                    </label>
                  </li>

                  <li class="flex items-center">
                    <input
                      id="fitbit"
                      type="checkbox"
                      value=""
                      checked=""
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />

                    <label
                      for="fitbit"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Cancelled (56)
                    </label>
                  </li>

                  <li class="flex items-center">
                    <input
                      id="dell"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />

                    <label
                      for="dell"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      In progress (56)
                    </label>
                  </li>

                  <li class="flex items-center">
                    <input
                      id="asus"
                      type="checkbox"
                      value=""
                      checked=""
                      class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />

                    <label
                      for="asus"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      In review (97)
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col mt-6 ">
          <div class="overflow-x-auto rounded-lg">
            <div class="inline-block min-w-full align-middle">
              <div class="shadow sm:rounded-lg  overflow-y-auto  h-[650px]">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                      >
                        Start Date
                      </th>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                      >
                        End Date
                      </th>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                      >
                        Priority
                      </th>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                      >
                        Budget
                      </th>
                      <th
                        scope="col"
                        class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800">
                    {filterProjects(projects)?.map((project) => (
                      <tr
                        key={project.id}
                        onClick={() =>
                          navigate(`/admin/project/detail/${project.id}`)
                        }
                        className="cursor-pointer"
                      >
                        <td
                          className={`p-4 text-sm   whitespace-nowrap  font-semibold`}
                        >
                          {project.title}
                        </td>
                        <td class="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          {project.location}
                        </td>
                        <td class="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                          {project.startDate}
                        </td>
                        <td class="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap  dark:text-white">
                          {project.endDate}
                        </td>
                        <td class="inline-flex items-center p-4 space-x-2 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          {project.priority}
                        </td>
                        <td class="p-4  text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          {project.budget}
                        </td>
                        <td class="p-4 whitespace-nowrap">
                          <span
                            class={`bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500 ${
                              project.status === "Completed"
                                ? "inline-block"
                                : "hidden"
                            }`}
                          >
                            Completed
                          </span>

                          <span
                            class={`bg-green-100 text-orange-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700  border border-orange-300  ${
                              project.status === "In Progress"
                                ? "inline-block"
                                : "hidden"
                            }`}
                          >
                            In Progress
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
