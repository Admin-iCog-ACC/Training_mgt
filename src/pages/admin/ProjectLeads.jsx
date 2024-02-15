import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer, Flip } from "react-toastify";

function ProjectLeads() {
  const [admins, setAdmins] = useState(null);
  const [email, setEmail] = useState("");
  const [showDeleteLead, setShowDeleteLead] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [projectLead, setProjectLead] = useState(null);
  const accountRequest = async (id, active) => {
    setDeleteLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/auth/deactivate/account/${id}`,
        { active },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Operation successful!", {
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
      setProjectLead(null);
      setShowDeleteLead(false);
      const index = admins.findIndex((admin) => admin.id === id);
      if (index !== -1) {
        const admin = admins[index];
        const newAdmins = [
          ...admins.slice(0, index),
          { ...admin, active },
          ...admins.slice(index + 1, admins.length),
        ];
        setAdmins(newAdmins);
      }
    } catch (error) {
      console.log(error);
    }
    setDeleteLoading(false);
  };
  const getAllAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res.data.admin);
      setAdmins(res.data.admin);
    } catch (error) {
      console.log(error);
    }
  };

  const searchLeads = () => {
    return admins?.filter(
      (admin) =>
        admin.email.toLowerCase().startsWith(email.toLowerCase().trim()) &&
        admin.role === "Project Lead"
    );
  };

  const getTimeDifference = (createdAt) => {
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

  useEffect(() => {
    getAllAdmins();
  }, []);
  return (
    <div>
      <ToastContainer />

      <div
        id="popup-modal"
        tabindex="-1"
        style={{ background: "rgba(0,0,0,0.6)" }}
        class={`flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
          showDeleteLead ? "block" : "hidden"
        } `}
      >
        <div class="relative p-4 w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
              onClick={() => setShowDeleteLead(false)}
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
                src={projectLead?.profileImage}
                alt={projectLead?.firstName}
                className={`w-12 h-12 rounded-full mx-auto mb-4 ${
                  projectLead?.profileImage ? "block" : "hidden"
                }`}
              />
              <section
                className={`w-12 h-12 rounded-full mx-auto mb-4  ${
                  projectLead?.profileImage ? "hidden" : "block"
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
                {projectLead?.firstName} {projectLead?.lastName}
              </section>
              <section className="text-sm text-gray-300">
                {projectLead?.email}
              </section>
              <h3 class="mb-5 mt-7 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to{" "}
                {projectLead?.status === "Deactivate"
                  ? "deactivate"
                  : "activate"}{" "}
                this project lead's account?
              </h3>
              <div className="flex justify-center align-center">
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={() =>
                    accountRequest(
                      projectLead?.id,
                      projectLead?.status === "Deactivate" ? false : true
                    )
                  }
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
                    <span>
                      {projectLead?.status === "Deactivate"
                        ? "Activating..."
                        : "Deactivating..."}
                    </span>
                  </div>
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={() => setShowDeleteLead(false)}
                  class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class=" bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
        <div class="w-full mb-5">
          <div class="mb-2 flex justify-between items-start">
            <nav class="flex " aria-label="Breadcrumb">
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
                      Project Leads
                    </a>
                  </div>
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
                      View
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
            <button
              onClick={() => {
                // setTrainerDrawer(true);
                // if (showDrawer) {
                //   setShowDrawer(false);
                // }
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
              Register
            </button>
          </div>
          <div class="sm:flex items-end justify-between">
            <div class="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
              <form class="lg:pr-3" action="#" method="GET">
                <div class="relative mt-1 lg:w-64 xl:w-96">
                  <input
                    type="text"
                    name="email"
                    id="users-search"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search for leads"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
              </form>
            </div>
            <div className="tex-sm text-gray-400">{`${
              searchLeads()?.length
            } found`}</div>
          </div>
        </div>
      </div>
      <div class="flex flex-col ">
        <div class="-m-1.5 overflow-x-auto">
          <div class="p-1.5 min-w-full inline-block align-middle">
            <div class="overflow-hidden">
              <table class="min-w-full divide-y border  border-gray-600 divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      First Name
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Last Name
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Project Posted
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Member Since
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  {searchLeads()?.map((admin) => {
                    return (
                      <tr key={admin.id} className="group">
                        {/* <div className="absolute z-20 hidden left-[50%]  bg-white border border-gray-600 rounded text-gray-900 group-hover:block">
                          <section className="border-b border-gray-300 flex items-center p-2">
                            <img
                              src={admin.imageURL}
                              alt={admin.firstName}
                              className={`${
                                admin.imageURL ? "block" : "hidden"
                              } w-14 h-14`}
                            />
                            <svg
                              viewBox="0 0 512 512"
                              fill="currentColor"
                              height="1em"
                              width="1em"
                              className={`inline  transition duration-100 transform cursor-pointer rounded-[50%]  hover:bg-gray-600 w-14 h-14 ${
                                admin.imageURL ? "hidden" : "block"
                              }`}
                            >
                              <path d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 01-6.14-.32 124.27 124.27 0 00-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 00-32.35 29.58 4 4 0 01-6.14.32A175.32 175.32 0 0180 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 01-46.68 119.25z" />
                              <path d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z" />
                            </svg>
                            <section>
                              <div className="font-bold  text-base">
                                {admin.firstName} {admin.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {admin.role}
                              </div>
                            </section>
                          </section>
                          <section className="px-4 p-2">
                            <div className="text-sm text-gray-800 flex items-center gap-x-2 justify-center">
                              <svg
                                class="flex-shrink-0 size-4 text-gray-600 dark:text-neutral-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="w-6 h-6"
                              >
                                <rect
                                  width="20"
                                  height="16"
                                  x="2"
                                  y="4"
                                  rx="2"
                                />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                              </svg>{" "}
                              {admin.email}
                            </div>
                          </section>
                        </div> */}
                        <td class=" px-6 py-4 whitespace-nowrap text-sm font-medium ">
                          {admin.firstName}
                        </td>
                        <td class=" px-6 py-4 whitespace-nowrap text-sm font-medium ">
                          {admin.lastName}
                        </td>
                        <td class=" px-6 py-4 whitespace-nowrap text-sm font-medium ">
                          {admin.email}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {admin.role}
                        </td>
                        <td class=" px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {admin.Projects.length}
                        </td>
                        <td class=" px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {getTimeDifference(admin.createdAt)}
                        </td>
                        <td
                          class={` px-6 py-4 whitespace-nowrap text-sm   ${
                            admin.active ? "text-green-400" : "text-red-500"
                          } `}
                        >
                          {admin.active ? "ACTIVE" : "INACTIVE"}
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          <button
                            type="button"
                            className={`px-2  inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-500 hover:text-red-400 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:hover:text-red-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-red-500 ${
                              admin.active ? "block" : "hidden"
                            }`}
                            onClick={() => {
                              setProjectLead({
                                ...admin,
                                status: "Deactivate",
                              });
                              setShowDeleteLead(true);
                            }}
                          >
                            Deactivate Account
                          </button>
                          <button
                            type="button"
                            className={`px-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-green-600 hover:text-green-800 disabled:opacity-50 disabled:pointer-events-none dark:text-green-500 dark:hover:text-green-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-green-600 ${
                              admin.active ? "hidden" : "block"
                            }`}
                            onClick={() => {
                              setProjectLead({ ...admin, status: "Activate" });
                              setShowDeleteLead(true);
                            }}
                          >
                            Activate Account
                          </button>
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
    </div>
  );
}

export default ProjectLeads;
