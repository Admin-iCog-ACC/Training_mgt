import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProjectDetail() {
  let { id } = useParams();
  const [project, setProject] = useState(null);
  const [ratingRationale, setRatingRationale] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();

  const [existingSearch, setExistingSearch] = useState({
    email: "",
    status: "",
  });
  const [newSearch, setNewSearch] = useState({ email: "", status: "" });
  const [statusRationale, setStatusRationale] = useState("");
  const [toBeDeleted, setToBeDeleted] = useState(null);
  const [trainerApplication, setTrainerApplication] = useState(null);
  const [updateProject, setUpdateProject] = useState(null);
  const [trainerDeleteLoading, setTrainerDeleteLoading] = useState(false);
  const [trainerUpdateLoading, setTrainerUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [showUpdateProjectImage, setShowUpdateProjectImage] = useState(false);
  const [projectPhotoUpdateLoading, setProjectPhotoUpdateLoading] =
    useState(false);
  const [imageURL, setImageURL] = useState("");
  const [image, setImage] = useState("");
  const [fileInputError, setFileInputError] = useState(false);
  const [trainerRating, setTrainerRating] = useState(null);

  const navigate = useNavigate();
  const deleteProject = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API}/api/project/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await axios.delete(
        `${import.meta.env.VITE_API}/api/deleteFile/${project.imageID}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Project successfully deleted!", {
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
        navigate("/admin/projects");
      }, 2500);
      setShowDeleteProject(false);
    } catch (error) {
      console.log(error);
    }
    setDeleteLoading(false);
  };

  const searchTrainers = () => {
    const { email, status } = newSearch;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page"))
      : 0;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit"))
      : 20;
    const total = project?.TrainersProjects?.filter(
      (item) => item.status === "Rejected" || item.status === "In Progress"
    ).length;
    return {
      projects: project?.TrainersProjects?.filter(
        (item) =>
          item?.Trainer?.email
            .toLowerCase()
            .startsWith(email.toLowerCase().trim()) &&
          (item?.status === "Rejected" || item?.status === "In Progress") &&
          item?.status
            .toLowerCase()
            .startsWith(status.toLocaleLowerCase().trim())
      ).slice(page * limit, page * limit + limit),
      total,
    };
  };
  const searchExistingTrainers = () => {
    const { email, status } = existingSearch;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page"))
      : 0;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit"))
      : 20;
    const total = project?.TrainersProjects?.filter(
      (item) => item.status === "Done" || item.status === "Accepted"
    ).length;
    return {
      projects: project?.TrainersProjects?.filter(
        (item) =>
          item?.Trainer?.email
            .toLowerCase()
            .startsWith(email.toLowerCase().trim()) &&
          (item?.status === "Accepted" || item?.status === "Done") &&
          item?.status
            .toLowerCase()
            .startsWith(status.toLocaleLowerCase().trim())
      ).slice(page * limit, page * limit + limit),
      total,
    };
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API}/api/project/${id}`,
        updateProject,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      setProject(updateProject);

      setUpdateProject(null);
      toast.success("Project successfully updated!", {
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
    } catch (error) {
      console.log(error);
    }
  };
  const manageTrainer = async () => {
    setTrainerDeleteLoading(true);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API}/api/application/${toBeDeleted?.id}/${id}`,
        { status: toBeDeleted.statusToBeSet, statusRationale },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);

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

      const index = project.TrainersProjects.findIndex(
        ({ Trainer }) => Trainer.id === toBeDeleted.id
      );

      const newTrainersProjects = [
        ...project.TrainersProjects.slice(0, index),
        {
          ...project.TrainersProjects[index],
          status: toBeDeleted.statusToBeSet,
          statusRationale: statusRationale,
          Trainer: {
            ...project.TrainersProjects[index].Trainer,
            TrainersProjects: [
              {
                ...project.TrainersProjects[index].Trainer.TrainersProjects[0],
                status: toBeDeleted.statusToBeSet,
              },
            ],
          },
        },
        ...project.TrainersProjects.slice(
          index + 1,
          project.TrainersProjects.length
        ),
      ];
      setProject({
        ...project,
        TrainersProjects: newTrainersProjects,
      });
      setToBeDeleted(null);
    } catch (error) {
      toast.error("Operation unsuccessful. Please try again!", {
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
      console.log(error);
    }
    setTrainerDeleteLoading(false);
  };
  const getProject = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/api/project/${id}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data.project);
      setProject(res.data.project);
    } catch (error) {
      console.log(error);
    }
  };

  const getTimeDifference = (createdAt) => {
    //   t, (_ = time.Parse(time.RFC3339, createdAt));
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

  const handleUpdateProjectChange = (e) => {
    const { name, value } = e.target;
    setUpdateProject((prev) => {
      return { ...prev, [name]: value };
    });
    console.log(name, value);
  };

  const handleFileInput = (e) => {
    const file = e.target.files["0"];
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setFileInputError(true);
      return;
    }
    setFileInputError(false);
    const imageUrl = URL.createObjectURL(file);
    setImageURL(imageUrl);
    const reader = new FileReader();

    reader.onload = () => {
      // console.log(reader.result);
      setImage(reader.result);
      // inputs.image = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const updateProjectPhoto = async () => {
    if (!imageURL) {
      return;
    }
    setProjectPhotoUpdateLoading(true);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API}/api/project/uploadImage/${project.id}`,
        { imageURL: image },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );

      console.log(res.data);

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
        setProject((prev) => {
          return {
            ...prev,
            imageID: res.data.project.imageID,
            imageURL: res.data.project.imageURL,
          };
        });

        setShowUpdateProjectImage(false);
        setImageURL("");
        setImage("");
      }, 4000);
    } catch (error) {
      console.log(error);
    }
    setProjectPhotoUpdateLoading(false);
  };

  const createRating = async (rating) => {
    setRatingLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/api/rating`,
        {
          trainerId: trainerApplication.Trainer.id,
          projectId: id,
          rating,
          ratingRationale,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );

      toast.success("Rating successfully recorded!", {
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

      setTrainerApplication({
        ...trainerApplication,
        Trainer: {
          ...trainerApplication.Trainer,
          rating: res.data.overallRating,
          TrainersRatings: [{ ...res.data.rating }],
        },
      });
      const index = project?.TrainersProjects?.findIndex(
        (item) => item.TrainerId === trainerApplication.TrainerId
      );
      const newTrainersProjects = [
        ...project.TrainersProjects.slice(0, index),
        {
          ...trainerApplication,
          Trainer: {
            ...trainerApplication.Trainer,
            rating: res.data.overallRating,
            TrainersRatings: [{ ...res.data.rating }],
          },
        },
        ...project.TrainersProjects.slice(
          index + 1,
          project.TrainersProjects.length
        ),
      ];
      const newProject = { ...project, TrainersProjects: newTrainersProjects };
      setProject(newProject);
    } catch (error) {
      console.log(error);
      toast.error("Operation failed. Please Try again!", {
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
    setRatingLoading(false);
  };
  const updateRating = async (rating) => {
    setRatingLoading(true);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API}/api/rating/project/${
          trainerApplication.Trainer.id
        }/${id}`,
        {
          rating,
          ratingRationale,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      console.log(res.data);

      setTrainerApplication({
        ...trainerApplication,
        Trainer: {
          ...trainerApplication.Trainer,
          rating: res.data.overallRating,
          TrainersRatings: [
            {
              ...trainerApplication?.Trainer?.TrainersRatings[0],
              rating,
              ratingRationale,
            },
          ],
        },
      });
      toast.success("Rating successfully recorded!", {
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

      const index = project?.TrainersProjects?.findIndex(
        (item) => item.TrainerId === trainerApplication.TrainerId
      );

      const newTrainersProjects = [
        ...project.TrainersProjects.slice(0, index),
        {
          ...trainerApplication,
          Trainer: {
            ...trainerApplication.Trainer,
            rating: res.data.overallRating,
            TrainersRatings: [
              {
                ...trainerApplication.Trainer.TrainersRatings,
                rating,
                ratingRationale,
              },
            ],
          },
        },
        ...project.TrainersProjects.slice(
          index + 1,
          project.TrainersProjects.length
        ),
      ];
      const newProject = { ...project, TrainersProjects: newTrainersProjects };
      setProject(newProject);
    } catch (error) {
      toast.error("Operation failed. Please Try again!", {
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
      console.log(error);
    }
    setRatingLoading(false);
  };

  const manageRating = async () => {
    if (!trainerRating.rating) {
      toast.error("Rating Rationale is required!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
      return;
    }

    if (!trainerApplication?.Trainer?.TrainersRatings[0]) {
      await createRating(trainerRating.rating);
      return;
    }

    // if(rating !== trainerApplication?.Trainer?.TrainersRatings[0]){
    await updateRating(trainerRating.rating);
    // }
  };

  const returnTrainerProjects = () => {
    var working = 0;
    var worked = 0;
    var applied = 0;
    var rejected = 0;
    console.log(trainerApplication?.Trainer);
    trainerApplication?.Trainer?.TrainersProjects?.map((application) => {
      if (application.status === "In Progress") {
        applied++;
      } else if (application.status === "Rejected") {
        rejected++;
      } else if (application.status === "Accepted") {
        working++;
      } else if (application.status === "Done") {
        worked++;
      }
    });
    return { worked, working, applied, rejected };
  };

  const { worked, working, applied, rejected } = returnTrainerProjects();
  console.log(trainerRating);
  useEffect(() => {
    getProject();
  }, [id]);

  return (
    <>
      <div
        id="drawer-contact"
        className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform border-l border-gray-600 bg-white w-[40%] dark:bg-gray-800 ${
          showDrawer ? "translate-x-1" : "translate-x-full"
        }`}
        tabindex="-1"
        aria-labelledby="drawer-contact-label"
      >
        <h5
          id="drawer-label"
          className="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            class={`w-4 h-4 me-2.5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white`}
          >
            <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM368 744c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v464zm192-280c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v184zm192 72c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v256z" />
          </svg>
          Trainer Application
        </h5>
        <button
          onClick={() => {
            setShowDrawer(false);
            setTrainerApplication(null);
            setRatingRationale("");
            setTrainerRating(null);
          }}
          type="button"
          data-drawer-hide="drawer-contact"
          aria-controls="drawer-contact"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
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
        <div>
          <div className="border border-gray-600 rounded py-4 px-3">
            <div className="flex justify-between items-center gap-x-4  mb-5   ">
              <div className="flex items-center gap-x-4">
                <section
                  className={`w-[90px] h-[90px] rounded-full  ${
                    trainerApplication?.Trainer?.profileImage
                      ? "hidden"
                      : "block"
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
                <img
                  src={`${trainerApplication?.Trainer?.profileImage}`}
                  alt=""
                  className={`w-[90px] h-[90px] rounded ${
                    trainerApplication?.Trainer?.profileImage
                      ? "visible"
                      : "hidden"
                  }`}
                />

                <div className="  flex-1">
                  <span className="block font-bold text-lg">
                    {trainerApplication?.Trainer?.firstName}{" "}
                    {trainerApplication?.Trainer?.lastName}
                  </span>
                  <span className="block text-sm text-gray-400">
                    {trainerApplication?.Trainer?.email}
                  </span>
                  <span className="block text-sm text-gray-400">
                    {trainerApplication?.Trainer?.phoneNumber}
                  </span>
                </div>
              </div>
              <div>
                <section className="flex">
                  {
                    <>
                      {trainerApplication?.Trainer?.rating === 0 && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                        </>
                      )}
                      {trainerApplication?.Trainer?.rating > 0 &&
                        trainerApplication?.Trainer?.rating < 1 && (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#888888"
                                d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#888888"
                                d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#888888"
                                d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#888888"
                                d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                              />
                            </svg>
                          </>
                        )}
                      {trainerApplication?.Trainer?.rating === 1 && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                        </>
                      )}
                      {trainerApplication?.Trainer?.rating > 1 &&
                        trainerApplication?.Trainer?.rating < 2 && (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#888888"
                                d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#888888"
                                d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#888888"
                                d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                              />
                            </svg>
                          </>
                        )}
                      {trainerApplication?.Trainer?.rating === 2 && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                        </>
                      )}
                      {trainerApplication?.Trainer?.rating > 2 &&
                        trainerApplication?.Trainer?.rating < 3 && (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#888888"
                                d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#888888"
                                d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                              />
                            </svg>
                          </>
                        )}
                      {trainerApplication?.Trainer?.rating === 3 && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                        </>
                      )}
                      {trainerApplication?.Trainer?.rating === 4 && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#888888"
                              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                            />
                          </svg>
                        </>
                      )}
                      {trainerApplication?.Trainer?.rating === 5 && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="orange"
                              d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                            />
                          </svg>
                        </>
                      )}
                      {trainerApplication?.Trainer?.rating > 3 &&
                        trainerApplication?.Trainer?.rating < 4 && (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#888888"
                                d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                              />
                            </svg>
                          </>
                        )}
                      {trainerApplication?.Trainer?.rating > 4 &&
                        trainerApplication?.Trainer?.rating < 5 && (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="orange"
                                d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                              />
                            </svg>
                          </>
                        )}
                    </>
                  }
                </section>
                <section className="text-center font-bold text-xl">
                  {trainerApplication?.Trainer?.rating}
                </section>
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-5">
              {trainerApplication?.Trainer?.bio}
            </div>
            <div className="">
              <div className="flex justify-between mb-2">
                <section className="flex items-center  gap-x-4 mb-2 flex-1">
                  <span className="block text-sm font-bold">Gender</span>
                  <span className="block text-gray-400 text-xs font-bold">
                    {trainerApplication?.Trainer?.gender}
                  </span>
                </section>
                <section className="flex items-center  gap-x-4 mb-2 flex-1">
                  <span className="block text-sm font-bold"> Address</span>
                  <span className="block text-gray-400 text-xs font-bold">
                    {trainerApplication?.Trainer?.address}
                  </span>
                </section>
              </div>
              <div className="flex justify-between mb-2">
                <section className="flex items-center gap-x-4 mb-2 flex-1">
                  <span className="block text-sm font-bold">Expertise</span>
                  <span className="block text-gray-400 text-xs font-bold">
                    {trainerApplication?.Trainer?.AreaofExpertise}
                  </span>
                </section>
                <section className="flex items-center gap-x-4 mb-2 flex-1 ">
                  <span className="block text-sm font-bold">
                    {" "}
                    Experience Level
                  </span>
                  <span className="block text-gray-400 text-xs font-bold">
                    {trainerApplication?.Trainer?.experienceLevel}
                  </span>
                </section>
              </div>
              <section className="flex items-center gap-x-4 mb-2">
                <span className="block text-sm font-bold"> CV</span>
                <span className="block text-gray-400 text-sm font-bold  cursor-pointer hover:underline">
                  {trainerApplication?.Trainer?.CvURL ? (
                    <a href={trainerApplication?.Trainer?.CvURL}>Here</a>
                  ) : (
                    "Upload"
                  )}
                </span>
              </section>
              <ul className="list-disc text-white px-4 mt-5">
                <li className="mt-2 text-lg text-gray-400">
                  Has worked on {worked} project(s)
                </li>
                <li className="mt-2 text-lg text-gray-400">
                  Currently working on {working} project(s)
                </li>
                <li className="mt-2 text-lg text-gray-400">
                  Currently applied on {applied} project(s)
                </li>
                <li className="mt-2 text-lg text-gray-400">
                  Has been rejected on {rejected} project(s)
                </li>
              </ul>
              <section
                className=" mt-7 bg-gray-700  py-2 rounded text-center cursor-pointer hover:bg-gray-600 "
                // onClick={() => setShowDeleteTrainer(true)}
              >
                Delete Application
              </section>
            </div>
          </div>

          <div className="border border-gray-600 bg-gray-900 rounded py-4 px-3 mt-4">
            <div className="mb-6 flex justify-between">
              <h5 className="inline-flex items-center text-base font-bold text-white uppercase ">
                Application - {project?.title}
              </h5>
              <section
                className={`text-sm tracking-wide font-bold ${
                  trainerApplication?.status === "In Progress" &&
                  "text-gray-400"
                } ${trainerApplication?.status === "Rejected" && "text-red-500"}
                ${
                  trainerApplication?.status === "Accepted" && "text-green-500"
                }`}
              >
                {trainerApplication?.status === "Done"
                  ? "Finished"
                  : trainerApplication?.status}
              </section>
            </div>
            <div
              className={`${
                trainerApplication?.status === "Done" ||
                trainerApplication?.status === "Rejected"
                  ? "hidden"
                  : "block"
              } text-base text-gray-400`}
            >
              <section className="  font-medium text-gray-200  mb-2 ">
                Why should we hire you for this project?
              </section>
              {trainerApplication?.description}
            </div>
            <div
              className={`${
                trainerApplication?.status === "Rejected" ? "block" : "hidden"
              }`}
            >
              {trainerApplication?.statusRationale}
            </div>
            <div
              className={`${
                (trainerApplication?.status !== "Done" ||
                  trainerApplication?.status === "Rejected") &&
                "hidden"
              } mt-6`}
            >
              <h5 className="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
                What is your rating for{" "}
                <span className="ml-1 text-white">
                  {trainerApplication?.Trainer?.firstName}{" "}
                  {trainerApplication?.Trainer?.lastName}
                </span>
                ?
              </h5>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  manageRating(trainerRating);
                }}
              >
                <section className="flex gap-x-3 mb-8">
                  <div
                    onClick={() =>
                      setTrainerRating({ ...trainerRating, rating: 1 })
                    }
                    className={`${
                      trainerRating?.rating === 1
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    } w-16 h-14 text-4xl  rounded  cursor-pointer flex items-center justify-center`}
                  >
                    1
                  </div>
                  <div
                    onClick={() =>
                      setTrainerRating({ ...trainerRating, rating: 2 })
                    }
                    className={`${
                      trainerRating?.rating === 2
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    } w-16 h-14 text-4xl  rounded cursor-pointer hover:bg-gray-600  flex items-center justify-center`}
                  >
                    2
                  </div>
                  <div
                    onClick={() =>
                      setTrainerRating({ ...trainerRating, rating: 3 })
                    }
                    className={`${
                      trainerRating?.rating === 3
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    } w-16 h-14 text-4xl  rounded cursor-pointer hover:bg-gray-600  flex items-center justify-center`}
                  >
                    3
                  </div>
                  <div
                    onClick={() =>
                      setTrainerRating({ ...trainerRating, rating: 4 })
                    }
                    className={`${
                      trainerRating?.rating === 4
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    } w-16 h-14 text-4xl  rounded cursor-pointer hover:bg-gray-600  flex items-center justify-center`}
                  >
                    4
                  </div>
                  <div
                    onClick={() =>
                      setTrainerRating({ ...trainerRating, rating: 5 })
                    }
                    className={`${
                      trainerRating?.rating === 5
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    } w-16 h-14 text-4xl  rounded cursor-pointer hover:bg-gray-600  flex items-center justify-center`}
                  >
                    5
                  </div>
                </section>
                <section>
                  <textarea
                    id="rating-rationale"
                    placeholder="Write Your Rational For The Above Rating"
                    value={ratingRationale}
                    required
                    onChange={(e) => setRatingRationale(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  ></textarea>
                </section>
                <section className="flex items-end ">
                  <button
                    type="submit"
                    className={`${
                      ratingLoading ? "hidden" : "block"
                    } bg-gray-600 mt-4 py-3 text-center text-base mx-auto px-10 rounded hover:bg-gray-700 `}
                  >
                    Save
                  </button>
                  <section
                    className={`${
                      ratingLoading ? "block" : "hidden"
                    }  mt-4 py-3 text-center text-base mx-auto px-10 rounded bg-gray-700 `}
                  >
                    Saving...
                  </section>
                </section>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        id="crud-modal"
        tabindex="-1"
        aria-hidden="true"
        style={{ background: "rgba(0,0,0,0.5" }}
        className={` overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
          showUpdateProjectImage ? "flex" : "hidden"
        }`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Update Project Photo
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
                onClick={() => {
                  setShowUpdateProjectImage(false);
                  // setUpdateProfile(false);
                  setImage("");
                  setImageURL("");
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
                <img src={imageURL} alt="" />
                <label
                  for="dropzone-file"
                  className={`${
                    imageURL ? "hidden" : "flex"
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
                onClick={updateProjectPhoto}
                className="text-white mt-3 inline-flex items-center bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                <svg
                  className={`me-1 -ms-1 w-5 h-5 ${
                    projectPhotoUpdateLoading ? "hidden" : "block"
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
                {projectPhotoUpdateLoading ? "Uploading...." : "Upload Photo"}
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
      <div
        id="popup-modal"
        tabindex="-1"
        style={{ background: "rgba(0,0,0,0.6)" }}
        class={`flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
          showDeleteProject ? "block" : "hidden"
        }`}
      >
        <div class="relative p-4 w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
              onClick={() => setShowDeleteProject(false)}
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
              <h3 class="mb-5 mt-7 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this project?
              </h3>
              <div className="flex justify-center align-center">
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={deleteProject}
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
                    <span>Deleting...</span>
                  </div>
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={() => setShowDeleteProject(false)}
                  class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="crud-modal"
        tabindex="-1"
        aria-hidden="true"
        style={{ background: "rgba(0,0,0,0.6)" }}
        class={`flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
          updateProject ? "block" : "hidden"
        }`}
      >
        <div class="relative  w-full max-w-2xl max-h-full ">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Update Project
              </h3>
              <button
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
                onClick={() => setUpdateProject(null)}
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
                <span class="sr-only">Close modal</span>
              </button>
            </div>

            <form class="p-4 md:p-5" onSubmit={handleUpdateProject}>
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2">
                  <label
                    for="title"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type product name"
                    required
                    value={updateProject?.title}
                    onChange={handleUpdateProjectChange}
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="location"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="country"
                    required
                    onChange={handleUpdateProjectChange}
                    value={updateProject?.location}
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="status"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={updateProject?.status}
                    onChange={handleUpdateProjectChange}
                    name="status"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="location"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="startDate"
                    required
                    onChange={handleUpdateProjectChange}
                    value={updateProject?.startDate}
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="status"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="End Date"
                    required
                    onChange={handleUpdateProjectChange}
                    value={updateProject?.endDate}
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="location"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Budget
                  </label>
                  <input
                    type="text"
                    name="budget"
                    id="budget"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Budget"
                    required
                    onChange={handleUpdateProjectChange}
                    value={updateProject?.budget}
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="status"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Priority
                  </label>

                  <select
                    id="status"
                    value={updateProject?.priority}
                    onChange={handleUpdateProjectChange}
                    name="priority"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="High">High</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div class="col-span-2">
                  <label
                    for="overview"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Project Overview
                  </label>
                  <textarea
                    id="overview"
                    rows="4"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Project overview"
                    value={updateProject?.overview}
                    onChange={handleUpdateProjectChange}
                    name="overview"
                  ></textarea>
                </div>
                <div class="col-span-2">
                  <label
                    for="overview"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Project Description
                  </label>
                  <textarea
                    id="overview"
                    rows="4"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Project description"
                    value={updateProject?.description}
                    name="description"
                    onChange={handleUpdateProjectChange}
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                class="text-white inline-flex items-center bg-gray-800 px-4 py-2 rounded hover:bg-gray-900"
              >
                {!trainerUpdateLoading && "Save project"}
                <div
                  role="status"
                  className={`text-white flex  justify-center items-center gap-x-1 ${
                    trainerUpdateLoading ? "block" : "hidden"
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
                  <span>Updating...</span>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
      <div
        id="popup-modal"
        tabindex="-1"
        style={{ background: "rgba(0,0,0,0.6)" }}
        class={`flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
          toBeDeleted ? "block" : "hidden"
        }`}
      >
        <div class="relative  w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
              onClick={() => setToBeDeleted(null)}
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
              <span class="sr-only">Close modal</span>
            </button>

            <div class="p-4 md:p-5 text-center">
              <img
                src={toBeDeleted?.profileImage}
                alt={toBeDeleted?.firstName}
                className="w-12 h-12 rounded-full mx-auto mb-4 bg-red-900"
              />
              <section className="text-lg font-bold">
                {toBeDeleted?.firstName} {toBeDeleted?.lastName}
              </section>
              <section className="text-sm text-gray-300">
                {toBeDeleted?.email}
              </section>
              <h3 class="mb-5 mt-7 text-lg font-normal text-gray-500 dark:text-gray-400">
                {toBeDeleted?.statusToBeSet === "Rejected" &&
                  "Are you sure you want to reject this trainer?"}
                {toBeDeleted?.statusToBeSet === "Accepted" &&
                  "Are you sure you want to accept this trainer?"}
                {toBeDeleted?.statusToBeSet === "In Progress" &&
                  "Are you sure you want to revert back this trainer?"}
                {toBeDeleted?.statusToBeSet === "Done" &&
                  "Are you sure this trainer has finished working on this project?"}
                <section
                  className={`${
                    toBeDeleted?.statusToBeSet !== "Done" && "hidden"
                  } text-white font-bold my-3`}
                >
                  This action can not be reverted!
                </section>
              </h3>

              <div
                className={`my-6 ${
                  toBeDeleted?.statusToBeSet === "Rejected" ? "block" : "hidden"
                }`}
              >
                <textarea
                  name=""
                  id=""
                  cols="40"
                  rows="10"
                  placeholder="Why is this trainer is being rejected?"
                  onChange={(e) => {
                    setStatusRationale(e.target.value);
                  }}
                  value={statusRationale}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                ></textarea>
              </div>
              <div className="flex justify-center align-center">
                <button
                  data-modal-hide="popup-modal"
                  onClick={() => {
                    if (
                      !statusRationale.trim() &&
                      toBeDeleted?.statusToBeSet === "Rejected"
                    ) {
                      return;
                    }
                    manageTrainer();
                    setStatusRationale("");
                  }}
                  type="button"
                  class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                >
                  {!trainerDeleteLoading && "Yes, I'm sure"}
                  <div
                    role="status"
                    className={`text-white flex  justify-center items-center gap-x-1 ${
                      trainerDeleteLoading ? "block" : "hidden"
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
                    <span>Loading...</span>
                  </div>
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={() => setToBeDeleted(null)}
                  class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md:flex no-wrap md:-mx-2 ">
        <div class="w-full md:w-9/12 mx-2 ">
          <div class="bg-white p-3 shadow-sm rounded-sm">
            <div class="flex justify-start items-center  space-x-2 font-semibold text-gray-900 leading-8 mb-3 px-4 ">
              <img
                class="h-14 w-14 rounded-lg cursor-pointer"
                onClick={() => setShowUpdateProjectImage(true)}
                src={project?.imageURL}
                alt=""
              />
              <span class="tracking-wide text-3xl">{project?.title}</span>
            </div>
            <div class="text-gray-700">
              <div class="grid md:grid-cols-2 text-sm">
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Title</div>
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
            </div>
            <div className="flex">
              <button
                onClick={() => setUpdateProject(project)}
                class="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
              >
                Show Full Information
              </button>
              <button
                onClick={() => setShowDeleteProject(true)}
                class="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
        <div class="w-full md:w-3/12 md:mx-2 ">
          <div
            className={`bg-white p-3 border-t-4  h-full ${
              project?.Admin?.active ? "border-green-400" : "border-red-700"
            }`}
          >
            <h1 class="text-gray-900 font-bold text-xl leading-8 my-1">
              <img
                class={`h-16 w-16 rounded-full mx-auto ${
                  !project?.Admin?.imageURL && "hidden"
                }`}
                src={project?.Admin?.imageURL}
                alt=""
              />{" "}
              <svg
                viewBox="0 0 512 512"
                fill="currentColor"
                height="1em"
                width="1em"
                className={`h-16 w-16 rounded-full mx-auto ${
                  project?.Admin?.imageURL ? "hidden" : "block"
                }`}
              >
                <path d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 01-6.14-.32 124.27 124.27 0 00-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 00-32.35 29.58 4 4 0 01-6.14.32A175.32 175.32 0 0180 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 01-46.68 119.25z" />
                <path d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z" />
              </svg>
              {project?.Admin?.firstName} {project?.Admin?.lastName}
            </h1>
            <h3 class="text-gray-600 font-lg text-semibold leading-6">
              {project?.Admin?.email}
            </h3>

            <ul class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
              <li class="flex items-center py-3">
                <span>Status</span>
                <span class="ml-auto">
                  <span
                    class={`bg-green-500 py-1 px-2 rounded text-white text-sm ${
                      project?.Admin?.active ? "block" : "hidden"
                    }`}
                  >
                    Active
                  </span>

                  <span
                    class={`bg-red-700 py-1 px-2 rounded text-white text-sm ${
                      project?.Admin?.active ? "hidden" : "block"
                    }`}
                  >
                    Unavailable
                  </span>
                </span>
              </li>
              <li
                class={`flex items-center py-3 ${
                  project?.Admin?.active ? "block" : "hidden"
                }`}
              >
                <span>Member since</span>
                <span class="ml-auto">
                  {getTimeDifference(project?.Admin?.createdAt)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="my-4"></div>
      <div className="flex gap-4 my-6">
        <section
          onClick={() => {
            const sp = new URLSearchParams(searchParams);
            sp.delete("trainers");
            sp.append("trainers", "new");
            setSearchParams(sp);
          }}
          className={`bg-gray-600 px-4 py-3 rounded cursor-pointer hover:bg-gray-700 ${
            searchParams.get("trainers")
              ? searchParams.get("trainers") === "new"
                ? "bg-gray-800  border border-gray-600"
                : ""
              : "bg-gray-800  border border-gray-600"
          }`}
        >
          Show New Trainers
        </section>
        <section
          onClick={() => {
            const sp = new URLSearchParams(searchParams);
            sp.delete("trainers");
            sp.append("trainers", "existing");
            setSearchParams(sp);
          }}
          className={`bg-gray-600 px-4 py-3 rounded cursor-pointer hover:bg-gray-700 ${
            searchParams.get("trainers") === "existing"
              ? "bg-gray-800  border border-gray-600"
              : ""
          }`}
        >
          Show Existing Trainers
        </section>
      </div>
      <div
        className={`flex flex-col bg-gray-800 pt-5 my-2 border-t mb-10 border-gray-400 ${
          !searchParams.get("trainers")
            ? "hidden"
            : searchParams.get("trainers") === "existing"
            ? "block"
            : "hidden"
        }`}
      >
        <h1 className="font-bold text-2xl mb-3 px-3 text-gray-400">
          Browse and Manage Existing Trainers Here
        </h1>
        <div class="sm:flex mb-3 px-3">
          <div class="items-center hidden sm:flex sm:divide-x w-full sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
            <form className=" w-full flex justify-between items-start ">
              <div class="items-center justify-between relative mt-1 lg:w-64 xl:w-96">
                <input
                  type="text"
                  name="email"
                  id="users-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search for existing trainers"
                  onChange={(e) =>
                    setExistingSearch((prev) => {
                      return { ...prev, email: e.target.value };
                    })
                  }
                  value={existingSearch.email}
                />
                <span className="text-sm">
                  {searchExistingTrainers()?.projects?.length} item
                  {searchExistingTrainers()?.projects?.length > 1 ? "s" : null}
                </span>
              </div>
              <select
                onChange={(e) =>
                  setExistingSearch((prev) => {
                    return { ...prev, status: e.target.value };
                  })
                }
                value={existingSearch.status}
                className="bg-gray-500  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:hover:bg-gray-800"
              >
                <option value="">Filter by trainer status</option>

                <option value="Accepted">Accepted</option>
                <option value="Done">Done</option>
              </select>
            </form>
          </div>
        </div>
        <div class={`overflow-x-auto `}>
          <div class="inline-block min-w-full align-middle">
            <div class="">
              <table class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead class="bg-gray-700 ">
                  <tr>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Trainer
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Gender
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Phone Number
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Expertise
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Overall Rating
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Application Date
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs text-center font-medium  text-gray-500 uppercase dark:text-gray-400"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class=" divide-y divide-gray-200  dark:bg-gray-800 dark:divide-gray-700">
                  {searchExistingTrainers()?.projects?.map((item) => {
                    return (
                      <tr
                        key={item.id}
                        class="hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          // return;
                          setTrainerApplication(item);
                          setRatingRationale(
                            item.Trainer.TrainersRatings[0]
                              ? item.Trainer.TrainersRatings[0].ratingRationale
                              : ""
                          );
                          console.log(item?.Trainer?.TrainersRatings);
                          setTrainerRating(item?.Trainer?.TrainersRatings[0]);
                          setShowDrawer(true);
                        }}
                      >
                        <td class="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
                          <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div class="text-base font-semibold text-gray-900 dark:text-white">
                              {item.Trainer.firstName} {item.Trainer.lastName}
                            </div>
                            <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                              {item.Trainer.email}
                            </div>
                          </div>
                        </td>
                        <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                          {item.Trainer.gender}
                        </td>
                        <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {item.Trainer.phoneNumber}
                        </td>
                        <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {item.Trainer.address}
                        </td>
                        <td class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                          <div class="flex items-center">
                            <div class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>{" "}
                            {item.Trainer.AreaofExpertise}
                          </div>
                        </td>
                        <td class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                          <section className="flex">
                            {
                              <>
                                {item.Trainer?.rating === 0 && (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                  </>
                                )}
                                {item.Trainer?.rating > 0 &&
                                  item.Trainer?.rating < 1 && (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                    </>
                                  )}
                                {item.Trainer?.rating === 1 && (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                  </>
                                )}
                                {item.Trainer?.rating > 1 &&
                                  item.Trainer?.rating < 2 && (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                    </>
                                  )}
                                {item.Trainer?.rating === 2 && (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>{" "}
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                  </>
                                )}
                                {item.Trainer?.rating > 2 &&
                                  item.Trainer?.rating < 3 && (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                    </>
                                  )}
                                {item.Trainer?.rating === 3 && (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                  </>
                                )}
                                {item.Trainer?.rating === 4 && (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                  </>
                                )}
                                {item.Trainer?.rating === 5 && (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                  </>
                                )}
                                {item.Trainer?.rating > 3 &&
                                  item.Trainer?.rating < 4 && (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                    </>
                                  )}
                                {item.Trainer?.rating > 4 &&
                                  item.Trainer?.rating < 5 && (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                    </>
                                  )}
                              </>
                            }
                          </section>
                        </td>
                        <td class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                          <div class="flex items-center">{item.status}</div>
                        </td>
                        <td class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                          <div class="flex items-center">
                            {formatDate(item.createdAt)}
                          </div>
                        </td>
                        <td class="p-4  whitespace-nowrap ">
                          <div className="flex justify-center gap-x-4">
                            <button
                              type="button"
                              data-modal-toggle="delete-user-modal"
                              className={`${
                                item.status === "Accepted" ? "block" : "hidden"
                              } inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setToBeDeleted({
                                  ...item.Trainer,
                                  statusToBeSet: "Done",
                                });
                              }}
                            >
                              Complete
                            </button>
                            <span
                              className={`${
                                item.status === "Done" ? "block" : "hidden"
                              }`}
                            >
                              -----
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <section
                className={`text-end pr-12 ${
                  searchExistingTrainers()?.total === 0 ? "hidden" : "block"
                }`}
              >
                {(searchParams.get("page")
                  ? parseInt(searchParams.get("page"))
                  : 0) *
                  (searchParams.get("limit")
                    ? parseInt(searchParams.get("limit"))
                    : 20)}{" "}
                -{" "}
                {(searchParams.get("page")
                  ? parseInt(searchParams.get("page"))
                  : 0) *
                  (searchParams.get("limit")
                    ? parseInt(searchParams.get("limit"))
                    : 20) +
                  (searchParams.get("limit")
                    ? parseInt(searchParams.get("limit"))
                    : 20) >
                searchExistingTrainers()?.total
                  ? searchExistingTrainers()?.total
                  : (searchParams.get("page")
                      ? parseInt(searchParams.get("page"))
                      : 0) *
                      (searchParams.get("limit")
                        ? parseInt(searchParams.get("limit"))
                        : 20) +
                    (searchParams.get("limit")
                      ? parseInt(searchParams.get("limit"))
                      : 20)}{" "}
                out of {searchExistingTrainers()?.total}
              </section>
              <section
                className={`flex justify-end items-center gap-4 ${
                  searchExistingTrainers()?.total === 0 ? "hidden" : "block"
                }`}
              >
                <section
                  className={`w-12 h-12 group  rounded-full flex items-center justify-center `}
                  onClick={() => {
                    const sp = new URLSearchParams(searchParams);

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
                    className={`w-5 h-5 rtl:rotate-180 `}
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
                    }}
                    value={
                      searchParams.get("limit") ? searchParams.get("limit") : 16
                    }
                  >
                    <option value={20}>20</option>

                    <option value={40}>40</option>
                    <option value={60}>60</option>
                    <option value={1}>1</option>
                  </select>
                </section>
                <section
                  className={`w-12 h-12 group  rounded-full flex items-center justify-center `}
                  onClick={() => {
                    const sp = new URLSearchParams(searchParams);

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
                    className={`w-5 h-5 rtl:rotate-180`}
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
        </div>
      </div>
      <div
        class={`flex flex-col border pt-5 my-2 border-gray-700 ${
          !searchParams.get("trainers")
            ? "block"
            : searchParams.get("trainers") === "new"
            ? "block"
            : "hidden"
        }`}
      >
        <h1 className="font-bold text-2xl mb-3 px-3">Here Are New Trainers</h1>
        <div class="sm:flex mb-3 px-3">
          <div class="items-center hidden sm:flex sm:divide-x w-full sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
            <form className=" w-full flex justify-between items-start ">
              <div class="items-center justify-between relative mt-1 lg:w-64 xl:w-96">
                <input
                  type="text"
                  name="email"
                  id="users-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search for new trainers"
                  onChange={(e) =>
                    setNewSearch((prev) => {
                      return { ...prev, email: e.target.value };
                    })
                  }
                  value={newSearch.email}
                />
                <span className="text-sm">
                  {searchTrainers()?.projects?.length} item
                  {searchTrainers()?.projects?.length > 1 ? "s" : null}
                </span>
              </div>
              <select
                onChange={(e) =>
                  setNewSearch((prev) => {
                    return { ...prev, status: e.target.value };
                  })
                }
                value={newSearch.status}
                className="bg-gray-500  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:hover:bg-gray-800"
              >
                <option value="">Filter by trainer status</option>
                <option value="In Progress">In Progress</option>
                <option value="Rejected">Rejected</option>
              </select>
            </form>
          </div>
        </div>
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="">
              <table class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead class="bg-gray-700 ">
                  <tr>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Trainer
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Gender
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Phone Number
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Expertise
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Overall Rating
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Application Date
                    </th>
                    <th
                      scope="col"
                      class="p-4 text-xs text-center font-medium  text-gray-500 uppercase dark:text-gray-400"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class=" divide-y divide-gray-200  dark:bg-gray-800 dark:divide-gray-700">
                  {searchTrainers()?.projects?.map((item) => {
                    return (
                      <tr
                        key={item.id}
                        class="hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setTrainerApplication(item);
                          setShowDrawer(true);
                          setTrainerRating(
                            trainerApplication?.Trainer?.TrainersRatings[0]
                          );
                        }}
                      >
                        <td class="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
                          <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div class="text-base font-semibold text-gray-900 dark:text-white">
                              {item.Trainer.firstName} {item.Trainer.lastName}
                            </div>
                            <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                              {item.Trainer.email}
                            </div>
                          </div>
                        </td>
                        <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                          {item.Trainer.gender}
                        </td>
                        <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {item.Trainer.phoneNumber}
                        </td>
                        <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {item.Trainer.address}
                        </td>
                        <td class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                          <div class="flex items-center">
                            <div class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>{" "}
                            {item.Trainer.AreaofExpertise}
                          </div>
                        </td>
                        <td class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                          <section className="flex">
                            {
                              <>
                                {item.Trainer?.rating === 0 && (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                  </>
                                )}
                                {item.Trainer?.rating > 0 &&
                                  item.Trainer?.rating < 1 && (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                    </>
                                  )}
                                {item.Trainer?.rating === 1 && (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                  </>
                                )}
                                {item.Trainer?.rating > 1 &&
                                  item.Trainer?.rating < 2 && (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                    </>
                                  )}
                                {item.Trainer?.rating === 2 && (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>{" "}
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                  </>
                                )}
                                {item.Trainer?.rating > 2 &&
                                  item.Trainer?.rating < 3 && (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                    </>
                                  )}
                                {item.Trainer?.rating === 3 && (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                  </>
                                )}
                                {item.Trainer?.rating === 4 && (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#888888"
                                        d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                      />
                                    </svg>
                                  </>
                                )}
                                {item.Trainer?.rating === 5 && (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="orange"
                                        d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                      />
                                    </svg>
                                  </>
                                )}
                                {item.Trainer?.rating > 3 &&
                                  item.Trainer?.rating < 4 && (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#888888"
                                          d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102zM12 13.25"
                                        />
                                      </svg>
                                    </>
                                  )}
                                {item.Trainer?.rating > 4 &&
                                  item.Trainer?.rating < 5 && (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="m7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="orange"
                                          d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325zM7.325 19.923l1.24-5.313l-4.123-3.572l5.431-.47L12 5.557l2.127 5.01l5.43.47l-4.122 3.572l1.24 5.313L12 17.102z"
                                        />
                                      </svg>
                                    </>
                                  )}
                              </>
                            }
                          </section>
                        </td>
                        <td class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                          <div class="flex items-center">{item.status}</div>
                        </td>
                        <td class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                          <div class="flex items-center">
                            {formatDate(item.createdAt)}
                          </div>
                        </td>
                        <td class="p-4  whitespace-nowrap ">
                          <div className="flex justify-center gap-x-4">
                            <button
                              type="button"
                              data-modal-toggle="delete-user-modal"
                              className={`${
                                item.status === "Rejected" ? "hidden" : "block"
                              } inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setToBeDeleted({
                                  ...item.Trainer,
                                  statusToBeSet: "Rejected",
                                });
                              }}
                            >
                              <svg
                                class="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                              Reject
                            </button>

                            <button
                              type="button"
                              data-modal-toggle="delete-user-modal"
                              className={`${
                                item.status === "Accepted" ? "hidden" : "block"
                              } inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-700`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setToBeDeleted({
                                  ...item.Trainer,
                                  statusToBeSet: "Accepted",
                                });
                              }}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              data-modal-toggle="delete-user-modal"
                              className={`${
                                item.status !== "In Progress"
                                  ? "block"
                                  : "hidden"
                              } inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-600 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700`}
                              onClick={(e) => {
                                e.stopPropagation();

                                setToBeDeleted({
                                  ...item.Trainer,
                                  statusToBeSet: "In Progress",
                                });
                              }}
                            >
                              Revert Back
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <section
                className={`text-end pr-12 ${
                  searchTrainers()?.total === 0 ? "hidden" : "block"
                }`}
              >
                {(searchParams.get("page")
                  ? parseInt(searchParams.get("page"))
                  : 0) *
                  (searchParams.get("limit")
                    ? parseInt(searchParams.get("limit"))
                    : 20)}{" "}
                -{" "}
                {(searchParams.get("page")
                  ? parseInt(searchParams.get("page"))
                  : 0) *
                  (searchParams.get("limit")
                    ? parseInt(searchParams.get("limit"))
                    : 20) +
                  (searchParams.get("limit")
                    ? parseInt(searchParams.get("limit"))
                    : 20) >
                searchTrainers()?.total
                  ? searchTrainers()?.total
                  : (searchParams.get("page")
                      ? parseInt(searchParams.get("page"))
                      : 0) *
                      (searchParams.get("limit")
                        ? parseInt(searchParams.get("limit"))
                        : 20) +
                    (searchParams.get("limit")
                      ? parseInt(searchParams.get("limit"))
                      : 20)}{" "}
                out of {searchTrainers()?.total}
              </section>
              <section
                className={`flex justify-end items-center gap-4 ${
                  searchTrainers()?.total === 0 ? "hidden" : "block"
                }`}
              >
                <section
                  className={`w-12 h-12 group  rounded-full flex items-center justify-center `}
                  onClick={() => {
                    const sp = new URLSearchParams(searchParams);

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
                    className={`w-5 h-5 rtl:rotate-180 `}
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
                    }}
                    value={
                      searchParams.get("limit") ? searchParams.get("limit") : 16
                    }
                  >
                    <option value={20}>20</option>

                    <option value={40}>40</option>
                    <option value={60}>60</option>
                    <option value={1}>1</option>
                  </select>
                </section>
                <section
                  className={`w-12 h-12 group  rounded-full flex items-center justify-center `}
                  onClick={() => {
                    const sp = new URLSearchParams(searchParams);

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
                    className={`w-5 h-5 rtl:rotate-180`}
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
        </div>
      </div>
    </>
  );
}

export default ProjectDetail;
