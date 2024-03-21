import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";

function TrainerRegistration() {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const token = searchParams.get("token");
  const verifyRegistrationToken = async () => {
    setVerifyLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/api/auth/verify_registration_token`,
        { token },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      console.log(res.data.result);
      setUser(res.data.result);
    } catch (error) {
      setError(true);
      console.log(error);
    }
    setVerifyLoading(false);
  };

  const handleTrainerActivation = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Password does not match.", {
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

    setFormLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/api/trainer/activate_trainer_account`,
        { token, password: form.password }
      );
      console.log(res.data);
      toast.success("Your account is successfully activated.", {
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
        navigate("/trainer_login");
      }, 2200);
    } catch (error) {
      if (error.response.status === 401) {
        setError(true);
      }
      console.log(error);
    }
    setFormLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      return { ...prev, [name]: value };
    });
  };
  useEffect(() => {
    verifyRegistrationToken();
  }, []);
  return (
    <div className="flex items-center h-[100vh] text-gray-900">
      <ToastContainer />
      <div
        className={`${
          !verifyLoading && error ? "block" : "hidden"
        } text-center w-full text-4xl text-red-700`}
      >
        This registration link has expired.
      </div>
      <div
        className={`${
          verifyLoading && !error ? "block" : "hidden"
        } text-center w-full text-4xl text-[#168c9e]`}
      >
        Loading.....Please wait!
      </div>
      <div
        className={`${
          verifyLoading || error ? "hidden" : "block"
        } container w-[600px] border shadow-lg mx-auto px-20 py-16`}
      >
        <h1 className="text-center mb-10 text-3xl">
          Welcome,{" "}
          <span className="font-bold text-[#168c9e]">
            {user?.firstName} {user?.lastName}
          </span>
        </h1>
        <section className="mb-2 text-[#168c9e]">
          Please use the form below to activate your account.
        </section>
        <form onSubmit={handleTrainerActivation}>
          <section className="mb-6">
            <label htmlFor="password" className="text-gray-500">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleFormChange}
              name="password"
              required
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </section>
          <section className="mb-6">
            <label htmlFor="confirm-password" className="text-gray-500">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={form.confirmPassword}
              name="confirmPassword"
              required
              onChange={handleFormChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </section>
          <section>
            <button
              type="submit"
              className={`${
                formLoading ? "hidden" : "block"
              } w-full py-3 text-[#168c9e] bg-gray-100 transition ease-linear duration-75 rounded tracking-wider text-lg hover:bg-[#168c9e] hover:text-white `}
            >
              Activate Account
            </button>
            <div
              className={`${
                formLoading ? "block" : "hidden"
              } w-full py-3 text-[#168c9e] bg-gray-100 text-lg text-center`}
            >
              Activating....
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

export default TrainerRegistration;
