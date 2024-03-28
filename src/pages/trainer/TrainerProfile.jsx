import axios from "axios";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";

function TrainerProfile() {
  const [user, setUser] = useState(null);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [fileInputError, setFileInputError] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [passwordInfo, setPasswordInfo] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [userPhotoDeleting, setUserPhotoDeleting] = useState(false);

  const deletePhoto = async () => {
    setUserPhotoDeleting(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API}/api/deleteFile/${user.profileImageId}`,
        {
          headers: {
            authorization: `"Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const res = await axios.patch(
        `${import.meta.env.VITE_API}/api/trainer/${user.id}`,
        { ...user, profileImage: null, profileImageId: null },
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

        transition: Flip,
      });
      setTimeout(() => {
        setUser((prev) => {
          return { ...prev, profileImageId: null, profileImage: null };
        });
      }, 4000);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
    setUserPhotoDeleting(false);
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

        transition: Flip,
      });
      return;
    }

    await updateUserPassword(oldPassword, newPassword);
  };
  const result = useOutletContext();

  //   const setHeaderUser = result.setUser;
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
        `${import.meta.env.VITE_API}/api/trainer/${user.id}`,
        user,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );

      console.log(res.data);
      toast.success("User successfully updated!", {
        position: "top-right",
        autoClose: 1999,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,

        transition: Flip,
      });
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

          transition: Flip,
        });
      }
      console.log(error);
    }
  };

  const updateUserPassword = async (oldPassword, newPassword) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API}/api/trainer/password/${user.id}`,
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
        `${import.meta.env.VITE_API}/api/trainer/uploadImage/${user.id}`,
        { profileImage: image },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );

      const { profileImage, profileImageId, createdAt, updatedAt } =
        res.data.trainer;
      toast.success("Photo successfully uploaded!", {
        position: "top-right",
        autoClose: 1999,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,

        transition: Flip,
      });
      setTimeout(() => {
        setUser({
          ...user,
          profileImage,
          profileImageId,
          createdAt,
          updatedAt,
          admin: false,
        });

        setOpenImageUpload(false);
        setImageUrl("");
        setImage("");
      }, 4000);
    } catch (error) {
      console.log(error);
      // return;
      if (error.response.status === 400) {
        toast.error("Incorrect old password!", {
          position: "top-right",
          autoClose: 1999,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,

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

          transition: Flip,
        });
      }
      console.log(error);
    }
    setPhotoLoading(false);
  };

  const passwordInfoChange = (e) => {
    console.log(e.target.name, e.target.value);
    setPasswordInfo((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

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

      const value = res.data;
      value.admin && localStorage.setItem("adminId", value.id);
      !value.admin && localStorage.setItem("userId", value.id);
      setUser(value);
    } catch (error) {
      console.log(error);
      // navigate("/login");
    }
  };

  useEffect(() => {
    verifyRequest();
  }, []);
  return (
    <>
      <ToastContainer />
      <div
        id="crud-modal"
        tabindex="-1"
        aria-hidden="true"
        style={{ background: "rgba(0,0,0,0.5)" }}
        className={` overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] min-h-full ${
          openImageUpload ? "flex" : "hidden"
        }`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow text-[#168c9e]">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold ">Update Admin Profile</h3>
              <button
                type="button"
                className="bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                onClick={() => {
                  setOpenImageUpload(false);
                  // setUpdateProfile(false);
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
              </button>
            </div>

            <form className="p-4 md:p-5">
              <div className="flex items-center justify-center w-full">
                <img src={imageUrl} alt="" />
                <label
                  for="dropzone-file"
                  className={`${
                    imageUrl ? "hidden" : "flex"
                  } flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800  hover:bg-gray-100 `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 "
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
                    <p className="mb-2 text-sm ">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs ">
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
                className=" mt-3 inline-flex items-center bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:b"
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
      <div className="grid grid-cols-4 px-20 py-8 gap-x-5 text-gray-900  ">
        <div className="col-span-1 ">
          <div className="p-4 mb-4  border bg-white rounded-lg  2xl:col-span-2  sm:p-6">
            <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
              <img
                className={`mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 ${
                  user?.profileImage ? "block" : "hidden"
                }`}
                src={user?.profileImage}
                alt={user?.firstName}
              />

              <div
                className={`mb-4 border  bg-gray-200  rounded-full w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 ${
                  user?.profileImage ? "hidden" : "block"
                } `}
              ></div>
              <div>
                <h3 className="mb-1 text-xl font-bold text-[#168c9e] ">
                  Profile picture
                </h3>
                <div className="mb-4 text-sm text-gray-500 ">
                  JPG, GIF or PNG. Max size of 800K
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setOpenImageUpload(true)}
                    class="inline-flex  border border-[#168c9e] text-[#168c9e]   items-center px-3 py-2 text-sm font-medium text-center  rounded-lg  hover:bg-gray-100"
                  >
                    <svg
                      class="w-4 h-4 mr-2 -ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                      <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
                    </svg>
                    Upload picture
                  </button>
                  <button
                    type="button"
                    onClick={deletePhoto}
                    className={`${
                      user?.profileImage ? "block" : "hidden"
                    } inline-flex  border border-[#168c9e] text-[#168c9e]   items-center px-3 py-2 text-sm font-medium text-center  rounded-lg  hover:bg-gray-100  `}
                  >
                    {userPhotoDeleting ? "Deleting.." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 mb-4 bg-white  border  rounded-lg 2xl:col-span-2  sm:p-6 ">
            <h3 className="mb-4 text-xl font-semibold text-[#168c9e] ">
              Password information
            </h3>
            <form onSubmit={handlePasswordUpdate}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-full ">
                  <label
                    for="current-password"
                    className="block mb-2 text-sm font-medium "
                  >
                    Current password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    id="current-password"
                    className="shadow-sm border border-[#168c9e] text-gray-900   sm:text-sm rounded-lg outline-none block w-full p-2.5  placeholder-gray-400"
                    placeholder="••••••••"
                    required
                    value={passwordInfo.oldPassword}
                    onChange={passwordInfoChange}
                  />
                </div>
                <div class="col-span-full ">
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    New password
                  </label>
                  <input
                    data-popover-target="popover-password"
                    data-popover-placement="bottom"
                    type="password"
                    id="password"
                    className="shadow-sm border border-[#168c9e] text-gray-900 sm:text-sm rounded-lg outline-none block w-full p-2.5  placeholder-gray-400"
                    placeholder="••••••••"
                    required
                    name="newPassword"
                    value={passwordInfo.newPassword}
                    onChange={passwordInfoChange}
                  />
                </div>
                <div class="col-span-full ">
                  <label
                    for="confirm-password"
                    class="block mb-2 text-sm font-medium "
                  >
                    Confirm password
                  </label>
                  <input
                    type="text"
                    name="confirmPassword"
                    id="confirm-password"
                    className="shadow-sm border border-[#168c9e] text-gray-900 sm:text-sm rounded-lg outline-none block w-full p-2.5  placeholder-gray-400"
                    placeholder="••••••••"
                    required
                    onChange={passwordInfoChange}
                    value={passwordInfo.confirmPassword}
                  />
                </div>
                <div class="col-span-full flex justify-center">
                  <button
                    class=" bg-[#168c9e] text-white mx-auto  items-center px-6 py-2 text-sm font-medium text-center rounded-lg hover:bg-[#01bfd4]"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="col-span-3">
          <div class="p-4 mb-4 bg-white   rounded-lg  2xl:col-span-2 sm:p-6 ">
            <h3 class="mb-4 text-xl font-semibold text-[#168c9e]">
              General information
            </h3>
            <form onSubmit={updateUser}>
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="first-name"
                    class="block mb-2 text-sm font-medium "
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    className="shadow-sm border border-[#168c9e] text-gray-900 sm:text-sm rounded-lg outline-none block w-full p-2.5  placeholder-gray-400"
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
                    class="block mb-2 text-sm font-medium "
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    className="shadow-sm border border-[#168c9e] text-gray-900 sm:text-sm rounded-lg outline-none block w-full p-2.5  placeholder-gray-400"
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
                  <label for="email" class="block mb-2 text-sm font-medium ">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="shadow-sm border border-[#168c9e] text-gray-900 sm:text-sm rounded-lg outline-none block w-full p-2.5  placeholder-gray-400"
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
                    className="block mb-2 text-sm font-medium "
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
                    className="shadow-sm border border-[#168c9e] bg-white text-gray-900 sm:text-sm rounded-lg outline-none block w-full p-2.5  placeholder-gray-400"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div class="col-span-6 sm:col-span-3">
                  <label for="address" class="block mb-2 text-sm font-medium ">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="shadow-sm border border-[#168c9e] text-gray-900 sm:text-sm rounded-lg outline-none block w-full p-2.5  placeholder-gray-400"
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
                    class="block mb-2 text-sm font-medium "
                  >
                    Contact No.
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    className="shadow-sm border border-[#168c9e] text-gray-900 sm:text-sm rounded-lg outline-none block w-full p-2.5  placeholder-gray-400"
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
                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="AreaofExpertise"
                    class="block mb-2 text-sm font-medium "
                  >
                    Area of Expertise
                  </label>
                  <input
                    type="text"
                    name="AreaofExpertise"
                    id="AreaofExpertise"
                    className="shadow-sm border border-[#168c9e] text-gray-900 sm:text-sm rounded-lg outline-none block w-full p-2.5  placeholder-gray-400"
                    placeholder="Your Area of Expertise"
                    required
                    value={user?.AreaofExpertise}
                    onChange={(e) =>
                      setUser((prev) => {
                        return { ...prev, AreaofExpertise: e.target.value };
                      })
                    }
                  />
                </div>
                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="experienceLevel"
                    class="block mb-2 text-sm font-medium "
                  >
                    Experience Level
                  </label>
                  <input
                    type="text"
                    name="experienceLevel"
                    id="experienceLevel"
                    className="shadow-sm border border-[#168c9e] text-gray-900 sm:text-sm rounded-lg outline-none block w-full p-2.5  placeholder-gray-400"
                    placeholder="Your Experience Level"
                    required
                    value={user?.experienceLevel}
                    onChange={(e) =>
                      setUser((prev) => {
                        return { ...prev, experienceLevel: e.target.value };
                      })
                    }
                  />
                </div>
                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="phoneNumber"
                    class="block mb-2 text-sm font-medium "
                  >
                    Bio
                  </label>
                  <input
                    type="text"
                    name="bio"
                    id="bio"
                    className="shadow-sm border border-[#168c9e] text-gray-900 sm:text-sm rounded-lg outline-none block w-full p-2.5  placeholder-gray-400"
                    placeholder="Your Phone Number"
                    required
                    value={user?.bio}
                    onChange={(e) =>
                      setUser((prev) => {
                        return { ...prev, bio: e.target.value };
                      })
                    }
                  />
                </div>
                <div class="col-span-full flex justify-center">
                  <button
                    className="py-2 px-6 text-sm font-medium text-white bg-[#168c9e] focus:outline-none  rounded-lg hover:bg-[#01bfd4]"
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
    </>
  );
}

export default TrainerProfile;
