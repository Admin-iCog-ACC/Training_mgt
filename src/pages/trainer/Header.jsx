import { Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Header() {
  const [user, setUser] = useState(null);
  const verifyRequest = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/verify", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")} `,
        },
      });
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
    <div className="bg-gray-200 h-screen">
      <nav
        id="main_navbar"
        class="sticky top-0 z-50 flex items-center justify-between gap-8 px-2 py-2  shadow  text-white border-b bg-[#168c9e] md:px-2"
      >
        <a href="/" class="flex items-center shrink-0 gap-x-3">
          <span class="hidden md:flex text-2xl mt-0.5 font-bold ">
            iCog-ACC
          </span>
        </a>
        <div class="flex items-center justify-center gap-x-4 ">
          <section className="cursor-pointer text-lg hover:text-gray-300">
            Projects
          </section>
          <section className="cursor-pointer text-lg hover:text-gray-300">
            Projects
          </section>
          <section className="cursor-pointer text-lg hover:text-gray-300">
            Projects
          </section>
        </div>
        <div class="hidden lg:flex items-center gap-2 cursor-pointer relative group">
          <div className="absolute hidden   py-2.5  px-2.5 -left-10  bg-white border    shadow top-14 cursor-auto group-hover:block">
            <div className="flex gap-x-6">
              <section className="w-[70px] h-[70px]  rounded-[50%] ">
                <img
                  src={user?.imageURL}
                  alt=""
                  className={` w-full h-full rounded-[50%] ${
                    user?.imageURL ? "block" : "hidden"
                  }`}
                />
                <svg
                  viewBox="0 0 512 512"
                  // fill="currentColor"
                  height="1em"
                  width="1em"
                  className={`inline w-full h-full transition duration-100 transform cursor-pointer rounded-[50%]   ${
                    user?.imageURL ? "hidden" : "block"
                  }`}
                >
                  <path d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 01-6.14-.32 124.27 124.27 0 00-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 00-32.35 29.58 4 4 0 01-6.14.32A175.32 175.32 0 0180 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 01-46.68 119.25z" />
                  <path d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z" />
                </svg>
              </section>
              <div className=" flex flex-col justify-center">
                <section className="text-lg text-[#168c9e] font-bold">
                  {user?.firstName} {user?.lastName}
                </section>
                <section className="text-base text-gray-400 font-medium">
                  {user?.role ? user?.role : "Trainer"}
                </section>
              </div>
            </div>
          </div>
          <span className="text-lg tracking-wide">{user?.email}</span>
          <section className="w-[40px] h-[40px]  rounded-[50%] ">
            <img
              src={user?.imageURL}
              className={` w-full h-full rounded-[50%] ${
                user?.imageURL ? "block" : "hidden"
              }`}
              alt=""
            />
            <svg
              viewBox="0 0 512 512"
              fill="currentColor"
              height="1em"
              width="1em"
              className={`inline w-full h-full transition duration-100 transform cursor-pointer rounded-[50%]  ${
                user?.imageURL ? "hidden" : "block"
              }`}
            >
              <path d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 01-6.14-.32 124.27 124.27 0 00-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 00-32.35 29.58 4 4 0 01-6.14.32A175.32 175.32 0 0180 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 01-46.68 119.25z" />
              <path d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z" />
            </svg>
          </section>
        </div>

        <div class="flex lg:hidden" dusk="mobile_menu_button">
          <button
            class="flex items-center p-1 navbar-burger "
            id="navbar_burger"
          >
            <svg
              class="block w-6 h-6 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Hamberger menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Header;
