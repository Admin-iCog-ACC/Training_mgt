import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";

function ChangePassword() {
  const [email, setEmail] = useState("");
  const [showDigitForm, setShowDigitForm] = useState(false);
  const [digitSending, setDigitSending] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [firstDigit, setFirstDigit] = useState("");
  const [secondDigit, setSecondDigit] = useState("");
  const [thirdDigit, setThirdDigit] = useState("");
  const [fourthDigit, setFourthDigit] = useState("");
  const [password, setPassword] = useState({ new: "", confirm: "" });
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/verify", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")} `,
        },
      });
      console.log(res.data);

      const value = res.data;

      setUser(value);
    } catch (error) {
      console.log(error);
      // navigate("/login");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setDigitSending(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/send_password_code",
        {
          email,
        }
      );
      toast.success("A four digit code is successfully sent to your email.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
      setShowDigitForm(true);
    } catch (error) {
      console.log(error);
      toast.error("Unable to send code to your email. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
    }
    setDigitSending(false);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPasswordUpdating(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/update/password",
        {
          password: password.new,
          recoveryDigits: `${firstDigit}${secondDigit}${thirdDigit}${fourthDigit}`,
          email,
        }
      );
      toast.success("Password successfully updated.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error("Invalid code", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
    }
    setPasswordUpdating(false);
  };
  useEffect(() => {
    // getUser();
  }, []);
  return (
    <main class="bg-gray-900">
      <ToastContainer />
      <div
        class={`flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900 ${
          showDigitForm ? "hidden" : "block"
        }`}
      >
        <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800">
          <div class="w-full p-6 sm:p-8">
            <h2 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              Forgot your password?
            </h2>
            <p class="text-base font-normal text-gray-500 dark:text-gray-400">
              Don't fret! We will send you a code to reset your password!
            </p>
            <form class="mt-8 space-y-6" onSubmit={resetPassword}>
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="name@company.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <button
                type="submit"
                class="w-full flex items-center gap-x-2 px-5 py-3 text-base font-medium text-center text-white rounded-lg bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 sm:w-auto "
              >
                <svg
                  aria-hidden="true"
                  className={`${
                    digitSending ? "block" : "hidden"
                  } w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white`}
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
                {digitSending
                  ? "Sending a code. Please wait!"
                  : "Reset password"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900 ${
          showDigitForm ? "block" : "hidden"
        }`}
      >
        <section className=" bg-gray-700 border border-gray-600 shadow rounded text-white py-10 px-8">
          <h1 className="text-2xl font-bold mb-5 ">Enter Recovery Digit</h1>
          <form action="" onSubmit={changePassword}>
            <section className="flex justify-between mb-7">
              <input
                type="text"
                className="w-[60px] h-[60px] rounded-lg outline-none text-gray-600 text-4xl px-4"
                required
                value={firstDigit}
                onChange={(e) => setFirstDigit(e.target.value)}
              />
              <input
                type="text"
                required
                className="w-[60px] h-[60px] rounded-lg outline-none text-gray-600 text-4xl px-4"
                value={secondDigit}
                onChange={(e) => setSecondDigit(e.target.value)}
              />
              <input
                type="text"
                required
                className="w-[60px] h-[60px] rounded-lg outline-none text-gray-600 text-4xl px-4"
                value={thirdDigit}
                onChange={(e) => setThirdDigit(e.target.value)}
              />
              <input
                type="text"
                required
                className="w-[60px] h-[60px] rounded-lg outline-none text-gray-600 text-4xl px-4"
                value={fourthDigit}
                onChange={(e) => setFourthDigit(e.target.value)}
              />
            </section>
            <input
              type="password"
              placeholder="New password"
              required
              className="block mb-5 py-2 rounded outline-none text-gray-600 px-2 text-lg"
              onChange={(e) =>
                setPassword((prev) => {
                  return { ...prev, new: e.target.value };
                })
              }
              value={password.new}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="block mb-5 py-2 rounded outline-none text-gray-600 px-2 text-lg"
              required
              value={password.confirm}
              onChange={(e) =>
                setPassword((prev) => {
                  return { ...prev, confirm: e.target.value };
                })
              }
            />

            <button
              type="submit"
              className="bg-gray-800 flex items-center justify-center gap-x-2 mt-6 w-full hover:bg-gray-600 px-6 py-2 border border-gray-600 rounded hover:border-gray-900"
            >
              <svg
                aria-hidden="true"
                className={`${
                  passwordUpdating ? "block" : "hidden"
                } w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white`}
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
              {passwordUpdating ? "Updating password..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default ChangePassword;
