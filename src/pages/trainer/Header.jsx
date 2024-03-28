import { NavLink, Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const verifyRequest = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/api/auth/verify`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      console.log(res.data);
      setUser(res.data);
    } catch (error) {
      console.log(error);
      // navigate("/login");
    }
  };

  useEffect(() => {
    verifyRequest();
  }, []);
  return (
    <div className="bg-gray-200 h-screen relative flex">
      <nav
        id="main_navbar"
        className={`text-white  bg-[#168c9e]  flex flex-col transition-all ease-in-out delay-150 duration-300 ${
          open ? "w-[313px]" : "w-[100px]"
        }`}
      >
        <div
          className={` text-4xl mt-4 font-bold text-center transition-all ease-in-out delay-150 duration-300 overflow-auto ${
            open ? "h-auto opacity-100" : "h-0 opacity-0"
          }`}
        >
          iCog-ACC
        </div>
        <div
          className={` text-4xl  font-bold text-center  transition-all ease-in-out delay-150 duration-300 overflow-auto ${
            !open ? "h-auto opacity-100" : "h-0 opacity-0"
          }`}
        >
          iCog
        </div>

        <nav
          className={`flex flex-col mt-10 flex-1 gap-y-10 justify-center  transition-all ease-in-out delay-150 duration-300 ${
            open ? "pr-4" : ""
          }`}
        >
          <NavLink
            to="/projects"
            className={`flex   items-center  cursor-pointer py-4 transition-all ease-in-out delay-200  duration-300 hover:bg-[#01bfd4]  ${
              open
                ? "rounded rounded-r-full gap-x-7 pl-10"
                : "gap-x-0 justify-center"
            }`}
            style={({ isActive }) => {
              return {
                background: isActive ? "#01bfd4" : "",
              };
            }}
          >
            <div className="flex ">
              <svg
                viewBox="0 0 1024 1024"
                fill="white"
                className={`w-[44px] h-[44px] `}
              >
                <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM368 744c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v464zm192-280c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v184zm192 72c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v256z" />
              </svg>
            </div>
            <div
              className={`text-2xl transition-all  ease-in-out delay-150 duration-300 overflow-auto ${
                open ? "h-auto w-auto  opacity-100" : "h-0 w-0 opacity-0"
              }`}
            >
              Projects
            </div>
          </NavLink>
          <NavLink
            to="/projectsd"
            className={`flex   items-center  cursor-pointer py-4 transition-all ease-in-out delay-200  duration-300 hover:bg-[#01bfd4]  ${
              open
                ? "rounded rounded-r-full gap-x-7 pl-10"
                : "gap-x-0 justify-center"
            }`}
            style={({ isActive }) => {
              return {
                background: isActive ? "#01bfd4" : "",
              };
            }}
          >
            <div className="flex ">
              <svg
                viewBox="0 0 1024 1024"
                fill="white"
                className={`w-[44px] h-[44px] `}
              >
                <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM368 744c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v464zm192-280c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v184zm192 72c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v256z" />
              </svg>
            </div>
            <div
              className={`text-2xl transition-all  ease-in-out delay-150 duration-300 overflow-auto ${
                open ? "h-auto w-auto  opacity-100" : "h-0 w-0 opacity-0"
              }`}
            >
              Your Projects
            </div>
          </NavLink>
          <NavLink
            to="/ratings"
            className={`flex   items-center  cursor-pointer py-4 transition-all ease-in-out delay-200  duration-300 hover:bg-[#01bfd4]  ${
              open
                ? "rounded rounded-r-full gap-x-7 pl-10"
                : "gap-x-0 justify-center"
            }`}
            style={({ isActive }) => {
              return {
                background: isActive ? "#01bfd4" : "",
              };
            }}
          >
            <div className="flex ">
              <svg
                viewBox="0 0 1024 1024"
                fill="white"
                className={`w-[44px] h-[44px] `}
              >
                <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM368 744c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v464zm192-280c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v184zm192 72c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v256z" />
              </svg>
            </div>
            <div
              className={`text-2xl transition-all  ease-in-out delay-150 duration-300 overflow-auto ${
                open ? "h-auto w-auto  opacity-100" : "h-0 w-0 opacity-0"
              }`}
            >
              Your Projects
            </div>
          </NavLink>
        </nav>
        <div
          className="bg-red-900"
          onClick={() => {
            setOpen(!open);
          }}
        >
          Change
        </div>
      </nav>

      <div className="flex-1 flex flex-col h-full overflow-auto">
        <div className=" z-40 sticky top-0 bg-white  flex items-center  pr-6 justify-end text-2xl">
          <div className="flex items-center gap-x-4 relative group  h-full my-4">
            <div className="absolute group-hover:flex hidden w-[200px] -left-10 text-lg  bg-gray-100 shadow-lg z-30  flex-col gap-y-4 top-16 py-2 ">
              <section
                className=" border-b py-3 cursor-pointer px-2 hover:bg-gray-200"
                onClick={() => navigate("/profile")}
              >
                {" "}
                Profile
              </section>
              <section
                className="border-t  py-3 cursor-pointer px-2 hover:bg-gray-200"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/trainer_login");
                }}
              >
                {" "}
                Logout
              </section>
            </div>
            <section
              className="hover:underline cursor-pointer"
              onClick={() => {
                navigate("/profile");
              }}
            >
              Hi, {user?.firstName}
            </section>
            <section
              className={`bg-[#01bfd4] rounded-full w-[40px] h-[40px] flex items-center justify-center ${
                user?.profileImage ? "hidden" : "block"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M12 11.385q-1.237 0-2.119-.882T9 8.385q0-1.238.881-2.12q.881-.88 2.119-.88t2.119.88q.881.882.881 2.12q0 1.237-.881 2.118T12 11.385m-7 7.23V16.97q0-.619.36-1.158q.361-.54.97-.838q1.416-.679 2.833-1.018q1.418-.34 2.837-.34q1.42 0 2.837.34q1.417.34 2.832 1.018q.61.298.97.838q.361.539.361 1.158v1.646z"
                />
              </svg>
            </section>
            <section
              className={`rounded-full w-[40px] h-[40px] flex items-center justify-center ${
                user?.profileImage ? "block" : "hidden"
              }`}
            >
              <img
                src={user?.profileImage}
                alt={user?.firstName}
                className={`rounded-full w-[40px] h-[40px] flex items-center justify-center ${
                  user?.profileImage ? "block" : "hidden"
                }`}
              />
            </section>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Header;
