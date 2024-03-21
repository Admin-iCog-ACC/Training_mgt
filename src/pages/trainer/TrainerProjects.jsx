import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState(null);
  const [stats, setStats] = useState(null);
  const [hasShadow, setHasShadow] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  let [searchParams, setSearchParams] = useSearchParams();
  const showNext =
    stats?.all <=
    (searchParams.get("page") ? parseInt(searchParams.get("page")) : 0) *
      (searchParams.get("limit") ? parseInt(searchParams.get("limit")) : 16) +
      (searchParams.get("limit") ? parseInt(searchParams.get("limit")) : 16)
      ? false
      : true;

  const showPrevious =
    (searchParams.get("page") ? parseInt(searchParams.get("page")) : 0) *
      (searchParams.get("limit") ? parseInt(searchParams.get("limit")) : 16) -
      (searchParams.get("limit") ? parseInt(searchParams.get("limit")) : 16) >=
    0
      ? true
      : false;
  const [search, setSearch] = useState({
    title: "",
    priority: "",
    status: "",
    start: "",
    end: "",
    location: "",
  });
  const navigate = useNavigate();
  const constructQueryPrams = (sp) => {
    let query = [];
    if (sp.get("applicationStatus")) {
      if (sp.get("applicationStatus") !== "All") {
        query = [...query, `applicationStatus=${sp.get("applicationStatus")}`];
      }
    }

    if (sp.get("location")) {
      query = [...query, `location=${sp.get("location")}`];
    }

    if (sp.get("priority")) {
      query = [...query, `priority=${sp.get("priority")}`];
    }

    if (sp.get("title")) {
      query = [...query, `title=${sp.get("title")}`];
    }

    if (sp.get("startDate")) {
      query = [...query, `startDate=${sp.get("startDate")}`];
    }
    if (sp.get("endDate")) {
      query = [...query, `endDate=${sp.get("endDate")}`];
    }
    if (sp.get("sortBy")) {
      query = [...query, `sortBy=${sp.get("sortBy")}`];
    }
    console.log(`?${query.join("&")}`);
    return `?${query.join("&")}`;
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    const sp = new URLSearchParams(searchParams);
    sp.delete(name);
    if (value.trim()) {
      sp.append(name, value);
    }
    setSearchParams(sp);
    const query = constructQueryPrams(sp);
    fetchProjects(query, searchParams.get("page"), searchParams.get("limit"));
  };

  const fetchProjects = async (query, page, limit) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/api/project${query}${
          query.length > 1 ? "&" : ""
        }page=${page ? page : 0}&limit=${limit ? limit : 16}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      setProjects(res.data.projects);
      setStats(res.data.stat);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const sp = new URLSearchParams(searchParams);

    const query = constructQueryPrams(sp);
    fetchProjects(query, searchParams.get("page"), searchParams.get("limit"));
  }, []);
  const handleScroll = () => {
    const threshold = 47;
    const isScrolling = window.scrollY > threshold;
    setHasShadow(isScrolling);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const array = new Array(5);
  console.log(array.length);
  return (
    <>
      <div
        className={` absolute left-0 top-0 right-0 bottom-0 min-h-screen  z-50 flex items-center justify-center ${
          searchParams.get("filter") ? "block" : "hidden"
        }`}
        style={{ background: "rgba(0,0,0,0.4)" }}
      >
        <section className="fixed top-72 bg-white rounded-lg p-5">
          <section className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Search Filters</h1>
            <section
              className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200"
              onClick={() => {
                const sp = new URLSearchParams(searchParams);
                sp.delete("filter");
                document.body.style.overflow = "auto";
                setSearchParams(sp);
              }}
            >
              <svg
                className="w-5 h-5 text-[#168c9e]"
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
          </section>
          <div className="grid grid-cols-5 gap-x-5 mt-4">
            <section className="w-[170px]">
              <h1 className="text-lg font-semibold text-[#168c9e]">LOCATION</h1>
              <section className="h-[1px] bg-gray-300 my-3"></section>
              <section
                className={`flex justify-between ${
                  searchParams.get("location") === "Addis Ababa"
                    ? "text-gray-900 font-semibold"
                    : ""
                } text-gray-500 text-base cursor-pointer hover:text-gray-700 my-3`}
                onClick={() => {
                  const sp = new URLSearchParams(searchParams);
                  sp.delete("location");
                  sp.append("location", "Addis Ababa");
                  setSearchParams(sp);
                  // console.log(sp.get("location"));
                  const query = constructQueryPrams(sp);

                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    searchParams.get("limit")
                  );
                }}
              >
                ADDIS ABABA
                <section
                  className={`w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200  ${
                    searchParams.get("location") === "Addis Ababa"
                      ? "block"
                      : "hidden"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const sp = new URLSearchParams(searchParams);
                    sp.delete("location");

                    setSearchParams(sp);
                    const query = constructQueryPrams(sp);

                    fetchProjects(
                      query,
                      searchParams.get("page"),
                      searchParams.get("limit")
                    );
                  }}
                >
                  <svg
                    className="w-3 h-3 text-[#168c9e]"
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
              </section>
              <section
                className={`flex justify-between items-center ${
                  searchParams.get("location") === "DIRE DAWA"
                    ? "text-gray-900 font-semibold"
                    : ""
                } text-gray-500 text-base cursor-pointer hover:text-gray-700 my-3`}
                onClick={() => {
                  const sp = new URLSearchParams(searchParams);
                  sp.delete("location");
                  sp.append("location", "DIRE DAWA");
                  setSearchParams(sp);
                  // console.log(sp.get("location"));
                  const query = constructQueryPrams(sp);

                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    searchParams.get("limit")
                  );
                }}
              >
                DIRE DAWA
                <section
                  className={`w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200  ${
                    searchParams.get("location") === "DIRE DAWA"
                      ? "block"
                      : "hidden"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const sp = new URLSearchParams(searchParams);
                    sp.delete("location");

                    setSearchParams(sp);
                    const query = constructQueryPrams(sp);

                    fetchProjects(
                      query,
                      searchParams.get("page"),
                      searchParams.get("limit")
                    );
                  }}
                >
                  <svg
                    className="w-3 h-3 text-[#168c9e]"
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
              </section>
              <section
                className={`flex justify-between items-center ${
                  searchParams.get("location") === "BAHIR DAR"
                    ? "text-gray-900 font-semibold"
                    : ""
                } text-gray-500 text-base cursor-pointer hover:text-gray-700 my-3`}
                onClick={() => {
                  const sp = new URLSearchParams(searchParams);
                  sp.delete("location");
                  sp.append("location", "BAHIR DAR");
                  setSearchParams(sp);
                  // console.log(sp.get("location"));
                  const query = constructQueryPrams(sp);

                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    searchParams.get("limit")
                  );
                }}
              >
                BAHIR DAR
                <section
                  className={`w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200  ${
                    searchParams.get("location") === "BAHIR DAR"
                      ? "block"
                      : "hidden"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const sp = new URLSearchParams(searchParams);
                    sp.delete("location");

                    setSearchParams(sp);
                    const query = constructQueryPrams(sp);

                    fetchProjects(
                      query,
                      searchParams.get("page"),
                      searchParams.get("limit")
                    );
                  }}
                >
                  <svg
                    className="w-3 h-3 text-[#168c9e]"
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
              </section>
              <section
                className={`flex justify-between items-center ${
                  searchParams.get("location") === "JIMMA"
                    ? "text-gray-900 font-semibold"
                    : ""
                } text-gray-500 text-base cursor-pointer hover:text-gray-700 my-3`}
                onClick={() => {
                  const sp = new URLSearchParams(searchParams);
                  sp.delete("location");
                  sp.append("location", "JIMMA");
                  setSearchParams(sp);
                  // console.log(sp.get("location"));
                  const query = constructQueryPrams(sp);

                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    searchParams.get("limit")
                  );
                }}
              >
                JIMMA
                <section
                  className={`w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200  ${
                    searchParams.get("location") === "JIMMA"
                      ? "block"
                      : "hidden"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const sp = new URLSearchParams(searchParams);
                    sp.delete("location");

                    setSearchParams(sp);
                    const query = constructQueryPrams(sp);

                    fetchProjects(
                      query,
                      searchParams.get("page"),
                      searchParams.get("limit")
                    );
                  }}
                >
                  <svg
                    className="w-3 h-3 text-[#168c9e]"
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
              </section>
              <section
                className={`flex justify-between items-center ${
                  searchParams.get("location") === "DESSE"
                    ? "text-gray-900 font-semibold"
                    : ""
                } text-gray-500 text-base cursor-pointer hover:text-gray-700 my-3`}
                onClick={() => {
                  const sp = new URLSearchParams(searchParams);
                  sp.delete("location");
                  sp.append("location", "DESSE");
                  setSearchParams(sp);
                  // console.log(sp.get("location"));
                  const query = constructQueryPrams(sp);

                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    searchParams.get("limit")
                  );
                }}
              >
                DESSE
                <section
                  className={`w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200  ${
                    searchParams.get("location") === "DESSE"
                      ? "block"
                      : "hidden"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const sp = new URLSearchParams(searchParams);
                    sp.delete("location");

                    setSearchParams(sp);
                    const query = constructQueryPrams(sp);

                    fetchProjects(
                      query,
                      searchParams.get("page"),
                      searchParams.get("limit")
                    );
                  }}
                >
                  <svg
                    className="w-3 h-3 text-[#168c9e]"
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
              </section>
            </section>
            <section className="w-[170px]">
              <h1 className="text-lg font-semibold text-[#168c9e]">PRIORITY</h1>
              <section className="h-[1px] bg-gray-300 my-3"></section>
              <section
                className={`flex justify-between items-center ${
                  searchParams.get("priority") === "High"
                    ? "text-gray-900 font-semibold"
                    : ""
                } text-gray-500 text-base cursor-pointer hover:text-gray-700 my-3`}
                onClick={() => {
                  const sp = new URLSearchParams(searchParams);
                  sp.delete("priority");
                  sp.append("priority", "High");
                  setSearchParams(sp);
                  // console.log(sp.get("location"));
                  const query = constructQueryPrams(sp);

                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    searchParams.get("limit")
                  );
                }}
              >
                HIGH
                <section
                  className={`w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200  ${
                    searchParams.get("priority") === "High" ? "block" : "hidden"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const sp = new URLSearchParams(searchParams);
                    sp.delete("priority");

                    setSearchParams(sp);
                    const query = constructQueryPrams(sp);

                    fetchProjects(
                      query,
                      searchParams.get("page"),
                      searchParams.get("limit")
                    );
                  }}
                >
                  <svg
                    className="w-3 h-3 text-[#168c9e]"
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
              </section>
              <section
                className={`flex items-center justify-between ${
                  searchParams.get("priority") === "Intermediate"
                    ? "text-gray-900 font-semibold"
                    : ""
                } text-gray-500 text-base cursor-pointer hover:text-gray-700 my-3`}
                onClick={() => {
                  const sp = new URLSearchParams(searchParams);
                  sp.delete("priority");
                  sp.append("priority", "Intermediate");
                  setSearchParams(sp);
                  // console.log(sp.get("location"));
                  const query = constructQueryPrams(sp);

                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    searchParams.get("limit")
                  );
                }}
              >
                INTERMEDIATE
                <section
                  className={`w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200  ${
                    searchParams.get("priority") === "Intermediate"
                      ? "block"
                      : "hidden"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const sp = new URLSearchParams(searchParams);
                    sp.delete("priority");

                    setSearchParams(sp);
                    const query = constructQueryPrams(sp);

                    fetchProjects(
                      query,
                      searchParams.get("page"),
                      searchParams.get("limit")
                    );
                  }}
                >
                  <svg
                    className="w-3 h-3 text-[#168c9e]"
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
              </section>
              <section
                className={`flex items-center justify-between ${
                  searchParams.get("priority") === "Low"
                    ? "text-gray-900 font-semibold"
                    : ""
                } text-gray-500 text-base cursor-pointer hover:text-gray-700 my-3`}
                onClick={() => {
                  const sp = new URLSearchParams(searchParams);
                  sp.delete("priority");
                  sp.append("priority", "Low");
                  setSearchParams(sp);
                  // console.log(sp.get("location"));
                  const query = constructQueryPrams(sp);

                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    searchParams.get("limit")
                  );
                }}
              >
                LOW
                <section
                  className={`w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200  ${
                    searchParams.get("priority") === "Low" ? "block" : "hidden"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const sp = new URLSearchParams(searchParams);
                    sp.delete("priority");

                    setSearchParams(sp);
                    const query = constructQueryPrams(sp);

                    fetchProjects(
                      query,
                      searchParams.get("page"),
                      searchParams.get("limit")
                    );
                  }}
                >
                  <svg
                    className="w-3 h-3 text-[#168c9e]"
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
              </section>
            </section>
            <section className="w-[170px]">
              <h1 className="text-lg font-semibold text-[#168c9e]">
                START DATE
              </h1>
              <section className="h-[1px] bg-gray-300 my-3"></section>

              <input
                type="date"
                className="bg-gray-200 text-gray-600 p-2"
                id="start"
                onChange={(e) => {
                  const sp = new URLSearchParams(searchParams);
                  sp.delete("startDate");
                  sp.append("startDate", e.target.value);
                  setSearchParams(sp);
                  // console.log(sp.get("location"));
                  const query = constructQueryPrams(sp);

                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    searchParams.get("limit")
                  );
                }}
                value={
                  searchParams.get("startDate")
                    ? searchParams.get("startDate")
                    : ""
                }
              />
              <section
                className={`cursor-pointer text-[#168c9e] text-sm hover:underline ${
                  searchParams.get("startDate") ? "block" : "hidden"
                }`}
                onClick={() => {
                  setSearchParams({});
                  const sp = new URLSearchParams(searchParams);

                  sp.delete("startDate");

                  setSearchParams(sp);

                  const query = constructQueryPrams(sp);
                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    searchParams.get("limit")
                  );
                }}
              >
                Clear Date
              </section>
            </section>
            <section className="w-[170px]">
              <h1 className="text-lg font-semibold text-[#168c9e]">END DATE</h1>
              <section className="h-[1px] bg-gray-300 my-3"></section>
              <input
                type="date"
                className="bg-gray-200 text-gray-600 p-2"
                id="start"
                onChange={(e) => {
                  const sp = new URLSearchParams(searchParams);
                  sp.delete("endDate");
                  sp.append("endDate", e.target.value);
                  setSearchParams(sp);
                  // console.log(sp.get("location"));
                  const query = constructQueryPrams(sp);

                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    searchParams.get("limit")
                  );
                }}
                value={
                  searchParams.get("endDate") ? searchParams.get("endDate") : ""
                }
              />
              <section
                className={`cursor-pointer text-[#168c9e] text-sm hover:underline ${
                  searchParams.get("endDate") ? "block" : "hidden"
                }`}
                onClick={() => {
                  setSearchParams({});
                  const sp = new URLSearchParams(searchParams);

                  sp.delete("endDate");

                  setSearchParams(sp);

                  const query = constructQueryPrams(sp);
                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    searchParams.get("limit")
                  );
                }}
              >
                Clear Date
              </section>
            </section>
            <section className="w-[170px]">
              <h1 className="text-lg font-semibold text-[#168c9e]">SORT BY</h1>
              <section className="h-[1px] bg-gray-300 my-3"></section>
              <section className="text-gray-500 text-base cursor-pointer hover:text-gray-700">
                POSTED DATE
              </section>
            </section>
          </div>
          <div
            className={`flex items-center justify-end ${
              searchParams.get("location") ||
              searchParams.get("priority") ||
              searchParams.get("sortBy") ||
              searchParams.get("startDate") ||
              searchParams.get("endDate")
                ? "block"
                : "hidden"
            }`}
          >
            <section
              className="cursor-pointer text-[#168c9e] text-lg hover:underline"
              onClick={() => {
                const sp = new URLSearchParams(searchParams);
                sp.delete("location");
                sp.delete("priority");
                sp.delete("sortBy");
                sp.delete("startDate");
                sp.delete("endDate");
                sp.delete("title");

                setSearchParams({});

                const query = constructQueryPrams(sp);

                fetchProjects(
                  query,
                  searchParams.get("page"),
                  searchParams.get("limit")
                );
              }}
            >
              Clear Search
            </section>
          </div>
        </section>
      </div>
      <div className=" ">
        <div class="px-4 relative  mt-3">
          <h1 className=" font-bold text-2xl">
            Discover Engaging Projects and Apply as a Trainer Today!
          </h1>
        </div>
        <div
          className={`sticky top-12 bg-gray-200 z-40 px-4  py-3 mb-4 ${
            hasShadow ? "shadow-xl" : ""
          }`}
        >
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
                value={
                  searchParams.get("title") ? searchParams.get("title") : ""
                }
              />
              <div className="flex items-end gap-x-4">
                <section>{stats?.current} found</section>
                <section
                  className={`cursor-pointer mt-1 hover:text-[#168c9e] ${
                    searchParams.get("title")?.trim() ||
                    searchParams.get("priority")?.trim() ||
                    searchParams.get("startDate")?.trim() ||
                    searchParams.get("location")?.trim() ||
                    searchParams.get("endDate")?.trim()
                      ? "inline"
                      : "hidden"
                  }`}
                  onClick={() => {
                    const sp = new URLSearchParams(searchParams);

                    sp.delete("priority");
                    sp.delete("title");
                    sp.delete("location");
                    sp.delete("startDate");
                    sp.delete("endDate");

                    setSearchParams(
                      searchParams.get("applicationStatus")
                        ? {
                            applicationStatus:
                              searchParams.get("applicationStatus"),
                          }
                        : {}
                    );
                    // fetchProjects("?");

                    const query = constructQueryPrams(sp);
                    console.log(query);
                    fetchProjects(
                      query,
                      searchParams.get("page"),
                      searchParams.get("limit")
                    );
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
                document.body.style.overflow = "hidden";
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
          </section>
          <section className="flex items-center gap-x-6 mt-3">
            <div
              className={`cursor-pointer px-5 py-3  rounded-lg ${
                !searchParams.get("applicationStatus")
                  ? "bg-[#168c9e] hover:bg-[#1badc4] text-white font-bold"
                  : "hover:bg-white bg-gray-400 text-white hover:text-[#168c9e]"
              }`}
              onClick={() => {
                const sp = new URLSearchParams(searchParams);
                sp.delete("applicationStatus");
                setSearchParams(sp);
                const query = constructQueryPrams(sp);
                fetchProjects(
                  query,
                  searchParams.get("page"),
                  searchParams.get("limit")
                );
              }}
            >
              All ({stats?.total})
            </div>
            <div
              className={`cursor-pointer px-5 py-3  rounded-lg ${
                searchParams.get("applicationStatus") === "Done"
                  ? "bg-[#168c9e] hover:bg-[#1badc4] text-white font-bold"
                  : "hover:bg-white bg-gray-400 text-white hover:text-[#168c9e]"
              }`}
              onClick={() => {
                const sp = new URLSearchParams(searchParams);
                sp.delete("applicationStatus");
                sp.append("applicationStatus", "Done");
                setSearchParams(sp);
                const query = constructQueryPrams(sp);
                fetchProjects(
                  query,
                  searchParams.get("page"),
                  searchParams.get("limit")
                );
              }}
            >
              Completed ({stats?.completed})
            </div>
            <div
              className={`cursor-pointer px-5 py-3  rounded-lg ${
                searchParams.get("applicationStatus") === "In Progress"
                  ? "bg-[#168c9e] hover:bg-[#1badc4] text-white font-bold"
                  : "hover:bg-white bg-gray-400 text-white hover:text-[#168c9e]"
              }`}
              onClick={() => {
                const sp = new URLSearchParams(searchParams);
                sp.delete("applicationStatus");
                sp.append("applicationStatus", "In Progress");
                setSearchParams(sp);
                const query = constructQueryPrams(sp);
                fetchProjects(
                  query,
                  searchParams.get("page"),
                  searchParams.get("limit")
                );
              }}
            >
              In-Progress ({stats?.inProgress})
            </div>
            <div
              className={`cursor-pointer px-5 py-3  rounded-lg ${
                searchParams.get("applicationStatus") === "Rejected"
                  ? "bg-[#168c9e] hover:bg-[#1badc4] text-white font-bold"
                  : "hover:bg-white bg-gray-400 text-white hover:text-[#168c9e]"
              }`}
              onClick={() => {
                const sp = new URLSearchParams(searchParams);
                sp.delete("applicationStatus");
                sp.append("applicationStatus", "Rejected");
                setSearchParams(sp);
                const query = constructQueryPrams(sp);
                fetchProjects(
                  query,
                  searchParams.get("page"),
                  searchParams.get("limit")
                );
              }}
            >
              Rejected ({stats?.rejected})
            </div>
          </section>
        </div>
        <div
          className={`${
            stats?.current === 0 ? "block" : "hidden"
          } text-center text-[#168c9e] font-bold text-2xl mt-36`}
        >
          No Project Found
        </div>
        <div className="grid grid-cols-4   gap-y-8 justify-items-center ">
          {[1, 2, 3, 4, 5, 7, 8].map((value, index) => {
            return (
              <div
                role="status"
                key={index}
                className={`${
                  projects ? "hidden" : "block"
                } p-4 border bg-white rounded shadow animate-pulse w-[450px]`}
              >
                <div className="flex items-center justify-center h-48 mb-4 bg-gray-200 rounded ">
                  <svg
                    className="w-10 h-10 text-gray-200 dark:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 20"
                  >
                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                  </svg>
                </div>
                <div className="flex justify-between">
                  <div className="h-2.5 bg-gray-200 rounded-full  w-48 mb-4"></div>
                  <div className="h-2.5 bg-gray-200 rounded-full  w-6 mb-4"></div>
                </div>
                <div className="h-2 w-36 bg-gray-200 rounded-full  mb-2.5"></div>
                <div className="h-2 w-36 bg-gray-200 rounded-full  mb-2.5"></div>
                <div className="h-2 w-36 bg-gray-200 rounded-full "></div>
                <div className="h-2  bg-gray-200  rounded-full mt-4"></div>
                <div className="h-2  bg-gray-200  rounded-full mt-2"></div>
                <div className="h-2  bg-gray-200  rounded-full mt-2"></div>
                <div className="h-2  bg-gray-200  rounded-full mt-2"></div>
                <div className="h-2  bg-gray-200  rounded-full mt-2"></div>
                <div className="h-2  bg-gray-200  rounded-full mt-2"></div>

                <span className="sr-only">Loading...</span>
              </div>
            );
          })}

          {projects?.map((project) => {
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
                    className={`${
                      search.location ? "block" : "hidden"
                    } text-sm`}
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
        <div
          className={`${
            stats?.current === 0 || !projects ? "hidden" : "block"
          } mt-4 flex flex-col items-end`}
        >
          <section className="px-3">
            {(searchParams.get("page")
              ? parseInt(searchParams.get("page"))
              : 0) *
              (searchParams.get("limit")
                ? parseInt(searchParams.get("limit"))
                : 16)}{" "}
            -{" "}
            {(searchParams.get("page")
              ? parseInt(searchParams.get("page"))
              : 0) *
              (searchParams.get("limit")
                ? parseInt(searchParams.get("limit"))
                : 16) +
              (searchParams.get("limit")
                ? parseInt(searchParams.get("limit"))
                : 16) >
            stats?.all
              ? stats?.all
              : (searchParams.get("page")
                  ? parseInt(searchParams.get("page"))
                  : 0) *
                  (searchParams.get("limit")
                    ? parseInt(searchParams.get("limit"))
                    : 16) +
                (searchParams.get("limit")
                  ? parseInt(searchParams.get("limit"))
                  : 16)}{" "}
            out of {stats?.all}
          </section>
          <section className={`flex items-center gap-4 `}>
            <section
              className={`w-12 h-12 group  rounded-full flex items-center justify-center ${
                showPrevious
                  ? "hover:bg-[#168c9e] cursor-pointer"
                  : "cursor-not-allowed"
              }`}
              onClick={() => {
                if (!showPrevious) {
                  return;
                }

                const sp = new URLSearchParams(searchParams);
                const query = constructQueryPrams(sp);
                fetchProjects(
                  query,
                  searchParams.get("page")
                    ? parseInt(searchParams.get("page")) - 1
                    : 0,
                  searchParams.get("limit")
                );
                sp.delete("page");
                sp.append(
                  "page",
                  searchParams.get("page")
                    ? parseInt(searchParams.get("page")) - 1
                    : 0
                );
                setSearchParams(sp);
              }}
            >
              <svg
                className={`w-5 h-5 rtl:rotate-180 ${
                  showPrevious
                    ? "text-[#168c9e] group-hover:text-white"
                    : "text-gray-500"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </section>
            <section>
              <select
                name="limit"
                id="limit"
                className="text-[#168c9e] px-3 py-2 bg-white rounded border border-[#168c9e] outline-none"
                onChange={(e) => {
                  const sp = new URLSearchParams(searchParams);
                  sp.delete("limit");
                  sp.append("limit", e.target.value);
                  setSearchParams(sp);
                  const query = constructQueryPrams(sp);
                  fetchProjects(
                    query,
                    searchParams.get("page"),
                    e.target.value
                  );
                }}
                value={
                  searchParams.get("limit") ? searchParams.get("limit") : 16
                }
              >
                <option value={16}>16</option>

                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </section>
            <section
              className={`w-12 h-12 group  rounded-full flex items-center justify-center ${
                showNext
                  ? "hover:bg-[#168c9e] cursor-pointer"
                  : "cursor-not-allowed"
              }`}
              onClick={() => {
                if (!showNext) {
                  return;
                }

                const sp = new URLSearchParams(searchParams);
                const query = constructQueryPrams(sp);
                fetchProjects(
                  query,
                  searchParams.get("page")
                    ? parseInt(searchParams.get("page")) + 1
                    : 1,
                  searchParams.get("limit")
                );
                sp.delete("page");
                sp.append(
                  "page",
                  searchParams.get("page")
                    ? parseInt(searchParams.get("page")) + 1
                    : 1
                );
                setSearchParams(sp);
              }}
            >
              <svg
                className={`w-5 h-5 rtl:rotate-180 ${
                  showNext
                    ? "text-[#168c9e] group-hover:text-white"
                    : "text-gray-500"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </section>
          </section>
        </div>
      </div>
    </>
  );
}

export default Projects;
