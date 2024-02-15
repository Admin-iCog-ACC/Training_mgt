import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";

function Profile() {
  const [user, setUser] = useState(null);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [fileInputError, setFileInputError] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [passwordInfo, setPasswordInfo] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [userPhotoDeleting, setUserPhotoDeleting] = useState(false);
  const navigate = useNavigate();
  const result = useOutletContext();

  const setHeaderUser = result.setUser;
  const handleFileInput = (e) => {
    const file = e.target.files["0"];
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setFileInputError(true);
      return;
    }
    setFileInputError(false);
    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
    const reader = new FileReader();

    reader.onload = () => {
      // console.log(reader.result);
      setImage(reader.result);
      // inputs.image = reader.result;
    };

    reader.readAsDataURL(file);
  };
  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/admin/${user.id}`,
        user,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );

      const {
        firstName,
        lastName,
        email,
        imageURL,
        imageID,
        id,
        createdAt,
        updatedAt,
        gender,
        address,
        phoneNumber,
      } = res.data.admin;
      toast.success("User successfully updated!", {
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

      setTimeout(() => {
        setHeaderUser({
          firstName,
          lastName,
          email,
          imageURL,
          imageID,
          id,
          createdAt,
          updatedAt,
          gender,
          address,
          phoneNumber,
          admin: true,
        });
      }, 4000);
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Email and/or phone number already used.", {
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
      } else if (error.response.status === 404) {
        toast.error("Admin not found! Try again.", {
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
      } else {
        toast.error("Failed to update user. Please try again! ", {
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
      }
      console.log(error);
    }
  };

  const updateUserPassword = async (oldPassword, newPassword) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/admin/password/${user.id}`,
        { oldPassword, newPassword },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );

      console.log(res.data);
      toast.success("Password successfully updated!", {
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
      setPasswordInfo({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Incorrect old password!", {
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
      } else if (error.response.status === 404) {
        toast.error("User not found", {
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
      } else {
        toast.error("Failed to update password! Please try again.", {
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
      }
      console.log(error);
    }
  };

  const updateUserPhoto = async () => {
    setPhotoLoading(true);
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/admin/uploadImage/${user.id}`,
        { profileImage: image },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );

      const { imageURL, imageID, createdAt, updatedAt } = res.data.admin;
      toast.success("Photo successfully uploaded!", {
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
      setTimeout(() => {
        setHeaderUser({
          ...result.user,
          imageURL,
          imageID,
          createdAt,
          updatedAt,
          admin: true,
        });
        setUser({
          ...result.user,
          imageURL,
          imageID,
          createdAt,
          updatedAt,
          admin: true,
        });

        setUpdateProfile(false);
        setImageUrl("");
        setImage("");
      }, 4000);
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Incorrect old password!", {
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
      } else if (error.response.status === 404) {
        toast.error("User not found", {
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
      } else {
        toast.error("Failed to update password! Please try again.", {
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
      }
      console.log(error);
    }
    setPhotoLoading(false);
  };

  const verifyRequest = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/verify", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")} `,
        },
      });
      console.log(res.data);

      const value = res.data;
      value.admin && localStorage.setItem("adminId", value.id);
      !value.admin && localStorage.setItem("userId", value.id);
      setUser(value);
    } catch (error) {
      console.log(error);
      // navigate("/login");
    }
  };

  const passwordInfoChange = (e) => {
    setPasswordInfo((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordInfo;

    if (newPassword !== confirmPassword) {
      toast.error("Password does not match!", {
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
    }

    await updateUserPassword(oldPassword, newPassword);
  };

  const deletePhoto = async () => {
    setUserPhotoDeleting(true);
    try {
      console.log("deleting...");
      console.log(user.imageID);
      await axios.delete(
        `http://localhost:3000/api/deleteFile/${user.imageID}`,
        {
          headers: {
            authorization: `"Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const res = await axios.patch(
        `http://localhost:3000/api/admin/${user.id}`,
        { imageURL: null, imageID: null },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      toast.success("Photo successfully deleted", {
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
      setTimeout(() => {
        setUser((prev) => {
          return { ...prev, imageID: null, imageURL: null };
        });
        setHeaderUser((prev) => {
          return { ...prev, imageID: null, imageURL: null };
        });
      }, 4000);
    } catch (error) {
      console.log(error);
    }
    setUserPhotoDeleting(false);
  };
  useEffect(() => {
    // setUser(result.user);
    verifyRequest();
  }, []);

  return (
    <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 ">
      <ToastContainer />
      <div
        id="crud-modal"
        tabindex="-1"
        aria-hidden="true"
        style={{ background: "rgba(0,0,0,0.5)" }}
        className={` overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
          updateProfile ? "flex" : "hidden"
        }`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Update Admin Profile
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => {
                  setUpdateProfile(false);
                  setImage("");
                  setImageUrl("");
                }}
              >
                <svg
                  className="w-3 h-3"
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
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <form className="p-4 md:p-5">
              <div className="flex items-center justify-center w-full">
                <img src={imageUrl} alt="" />
                <label
                  for="dropzone-file"
                  className={`${
                    imageUrl ? "hidden" : "flex"
                  } flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={updateUserPhoto}
                className="text-white mt-3 inline-flex items-center bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                <svg
                  className={`me-1 -ms-1 w-5 h-5 ${
                    photoLoading ? "hidden" : "block"
                  }`}
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
                {photoLoading ? "Uploading...." : "Upload Photo"}
              </button>
              <div
                className={`text-sm mt-1 text-red-500 ${
                  fileInputError ? "block" : "hidden"
                }`}
              >
                Invalid File type
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mb-4 col-span-full xl:mb-2">
        <nav className="flex mb-5" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
            <li className="inline-flex items-center">
              <a
                href="#"
                className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white"
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
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
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
                  className="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white"
                >
                  Admin
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Admin settings
        </h1>
      </div>
      <div className="col-span-full xl:col-auto">
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
            <img
              className={`mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 ${
                user?.imageURL ? "block" : "hidden"
              }`}
              src={user?.imageURL}
              alt={user?.firstName}
            />
            <div
              className={`mb-4 border border-gray-600 bg-gray-600 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 ${
                user?.imageURL ? "hidden" : "block"
              } `}
            ></div>
            <div>
              <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                Profile picture
              </h3>
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                JPG, GIF or PNG. Max size of 800K
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setUpdateProfile(true)}
                  class="inline-flex  border border-gray-600   items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg  bg-gray-700 hover:bg-gray-800 "
                >
                  {/* <svg
                    class="w-4 h-4 mr-2 -ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                    <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
                  </svg> */}
                  Upload picture
                </button>
                <button
                  type="button"
                  onClick={deletePhoto}
                  className={`${
                    user?.imageURL ? "block" : "hidden"
                  } py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
                >
                  {userPhotoDeleting ? "Deleting.." : "Delete picture"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold dark:text-white">
            Password information
          </h3>
          <form onSubmit={handlePasswordUpdate}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  for="current-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Current password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  id="current-password"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="••••••••"
                  required
                  value={passwordInfo.oldPassword}
                  onChange={passwordInfoChange}
                />
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New password
                </label>
                <input
                  data-popover-target="popover-password"
                  data-popover-placement="bottom"
                  type="password"
                  id="password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  name="newPassword"
                  value={passwordInfo.newPassword}
                  onChange={passwordInfoChange}
                />
                <div
                  data-popover=""
                  id="popover-password"
                  role="tooltip"
                  class="absolute z-10 invisible inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                  //   style="position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate(1156px, -1382px);"
                  data-popper-placement="top"
                  data-popper-reference-hidden=""
                  data-popper-escaped=""
                >
                  <div class="p-3 space-y-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                      Must have at least 6 characters
                    </h3>
                    <div class="grid grid-cols-4 gap-2">
                      <div class="h-1 bg-orange-300 dark:bg-orange-400"></div>
                      <div class="h-1 bg-orange-300 dark:bg-orange-400"></div>
                      <div class="h-1 bg-gray-200 dark:bg-gray-600"></div>
                      <div class="h-1 bg-gray-200 dark:bg-gray-600"></div>
                    </div>
                    <p>It’s better to have:</p>
                    <ul>
                      <li class="flex items-center mb-1">
                        <svg
                          class="w-4 h-4 mr-2 text-green-400 dark:text-green-500"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        Upper &amp; lower case letters
                      </li>
                      <li class="flex items-center mb-1">
                        <svg
                          class="w-4 h-4 mr-2 text-gray-300 dark:text-gray-400"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        A symbol (#$&amp;)
                      </li>
                      <li class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-2 text-gray-300 dark:text-gray-400"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        A longer password (min. 12 chars.)
                      </li>
                    </ul>
                  </div>
                  <div
                    data-popper-arrow=""
                    // style="position: absolute; left: 0px; transform: translate(139px, 0px);"
                  ></div>
                </div>
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="confirm-password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="text"
                  name="confirmPassword"
                  id="confirm-password"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="••••••••"
                  required
                  onChange={passwordInfoChange}
                  value={passwordInfo.confirmPassword}
                />
              </div>
              <div class="col-span-6 sm:col-full">
                <button
                  class="border border-gray-600   items-center px-6 py-2 text-sm font-medium text-center text-white rounded-lg  bg-gray-700 hover:bg-gray-800 "
                  type="submit"
                >
                  Save all
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="col-span-2">
        <div class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 class="mb-4 text-xl font-semibold dark:text-white">
            General information
          </h3>
          <form onSubmit={updateUser}>
            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="first-name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your first name"
                  required
                  value={user?.firstName}
                  onChange={(e) =>
                    setUser((prev) => {
                      return { ...prev, firstName: e.target.value };
                    })
                  }
                />
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="last-name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your last name"
                  required
                  value={user?.lastName}
                  onChange={(e) =>
                    setUser((prev) => {
                      return { ...prev, lastName: e.target.value };
                    })
                  }
                />
              </div>

              <div class="col-span-6 sm:col-span-3">
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your email"
                  required
                  value={user?.email}
                  onChange={(e) =>
                    setUser((prev) => {
                      return { ...prev, email: e.target.value };
                    })
                  }
                />
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="gender"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Gender
                </label>
                <select
                  onChange={(e) =>
                    setUser((prev) => {
                      return { ...prev, gender: e.target.value };
                    })
                  }
                  name="gender"
                  id="gender"
                  value={user?.gender}
                  className="w-full mb-4 sm:mb-0 mr-4 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="address"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your address"
                  required
                  value={user?.address}
                  onChange={(e) =>
                    setUser((prev) => {
                      return { ...prev, address: e.target.value };
                    })
                  }
                />
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="phoneNumber"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contact No.
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your Phone Number"
                  required
                  value={user?.phoneNumber}
                  onChange={(e) =>
                    setUser((prev) => {
                      return { ...prev, phoneNumber: e.target.value };
                    })
                  }
                />
              </div>
              <div class="col-span-6 sm:col-full">
                <button
                  className="py-2 px-6 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  type="submit"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
