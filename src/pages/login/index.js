import styles from "../../styles";
import { useState } from "react";
import classes from "../../styles/contactSection.module.css";
import axios from "axios";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "next/router";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import HourglassFullRoundedIcon from "@mui/icons-material/HourglassFullRounded";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { setCookie } from "nookies";

export default function LoginRegister() {
  const router = useRouter();
  const {setAuthenticated} = useAuth();

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [passsword, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signup, setSignup] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    message: "",
    icon: null,
    styling: "",
  });

  const resetForm = () => {
    setFname("");
    setLname("");
    setUsername("");
    setPassword("");
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fname || !lname || !username || !passsword) {
      setErrorMessage({
        message: "Please fill all the fields",
        icon: <CancelRoundedIcon />,
        styling: "bg-red-400 text-red-700",
      });
      setLoginError(true);
      return;
    }

    const formData = new FormData();
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("username", username);
    formData.append("password", passsword);

    setErrorMessage({
      message: "Registering...",
      icon: <HourglassFullRoundedIcon />,
      styling: "bg-blue-300 text-blue-700",
    });
    setLoginError(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}users/addNewUser`,
        formData
      );
      setErrorMessage({
        message: "Registration Successful",
        icon: <CheckCircleRoundedIcon/>,
        styling: "bg-green-300 text-green-700",
      });
      setLoginError(true);
      setSignup(false);
    } catch (error) {
      console.log(error);
      setErrorMessage({
        message: "Error in registration",
        icon: <CancelRoundedIcon />,
        styling: "bg-red-400 text-red-700",
      });
      setLoginError(true);
    }

  };

  const handleLogin = async (e, setAuthenticated) => {
    e.preventDefault();
    console.log(showPassword);
    console.log(signup);
    if (!username || !passsword) {
      setErrorMessage({
        message: "Please fill all the fields",
        icon: <ErrorRoundedIcon />,
        styling: "bg-yellow-300 text-yellow-700",
      });
      setLoginError(true);
      return;
    }
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", passsword);

    setErrorMessage({
      message: "Authenticating...",
      icon: <HourglassFullRoundedIcon />,
      styling: "bg-blue-300 text-blue-700",
    });
    setLoginError(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}users/verifyUser`,
        formData,
        );
        if (response.status === 200) {
          setCookie(null, "token", response.data.token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          })
          setAuthenticated(true);
          router.push("/dashboard");
        } else {
          setErrorMessage({
            message: "Invalid Credentials",
            icon: <CancelRoundedIcon />,
            styling: "bg-red-400 text-red-700",
          });
          setLoginError(true);
        }
      setLoginError(false);
    } catch (error) {
      setErrorMessage({
        message: "Invalid Credentials",
        icon: <CancelRoundedIcon />,
        styling: "bg-red-400 text-red-700",
      });
      setLoginError(true);
    }
  };

  return (
    <div className="relative">
      <div className="gradient-03" />
      <div className="gradient-02"/>
      <div
        className={`${styles.paddings} text-white font-poppins z-30 relative`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center py-10 xs:mx-10 md:mx-0 lg:mx-20">
            <div className="pb-8">
              <div
                className={`lg:text-[45px] md:text-[35px] text-[40px] font-bold font-tungsten`}
              >
                {signup ? "Greetings!" : "Welcome Back!"}
              </div>
              <p className={``}>Please Enter Your Details Below</p>
            </div>
            {!signup ? (
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <input
                    type="username"
                    name="username"
                    value={username}
                    onChange={(e) => {
                      setLoginError(false);
                      setUsername(e.target.value);
                    }}
                    autoComplete="off"
                    placeholder="Enter Email"
                    className={`${classes.formInputs}`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={passsword}
                    onChange={(e) => {
                      setLoginError(false);
                      setPassword(e.target.value);
                    }}
                    placeholder="Enter Password"
                    className={`${classes.formInputs}`}
                  />
                  <div className="flex flex-row justify-between">
                    <div
                      className="items-center flex gap-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <input
                        type="checkbox"
                        className="cursor-pointer rounded-md h-4 w-4"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                      />
                      <label className="text-xs select-none cursor-pointer">
                        Show Password
                      </label>
                    </div>
                    <button href="#" className="underline text-xs select-none">
                      Forgot Password?
                    </button>
                  </div>
                  <button
                    className="bg-orange-700 py-[8px] px-[24px] w-full rounded-md mt-4 hover:bg-orange-900 hover:font-bold"
                    onClick={(e) => {
                      handleLogin(e, setAuthenticated);
                    }}
                  >
                    Login
                  </button>
                  {loginError && (
                    <div
                      className={`flex items-center gap-3 rounded-md px-[24px] py-[8px] justify-center text-[20px] font-bold ${errorMessage.styling}`}
                    >
                      {errorMessage.icon} {errorMessage.message}
                    </div>
                  )}
                </div>
              </form>
            ) : (
              <form>
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex flex-col gap-1">
                    <label>Name</label>
                    <input
                      type="name"
                      name="fname"
                      value={fname}
                      onChange={(e) => {
                        setLoginError(false);
                        setFname(e.target.value);
                      }}
                      autoComplete="off"
                      placeholder="Enter First Name"
                      className={`${classes.formInputs}`}
                    />
                    <input
                      type="name"
                      name="lname"
                      value={lname}
                      onChange={(e) => {
                        setLoginError(false);
                        setLname(e.target.value);
                      }}
                      autoComplete="off"
                      placeholder="Enter Last Name"
                      className={`${classes.formInputs}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Email</label>
                    <input
                      type="username"
                      name="username"
                      value={username}
                      onChange={(e) => {
                        setLoginError(false);
                        setUsername(e.target.value);
                      }}
                      autoComplete="off"
                      placeholder="Enter Email"
                      className={`${classes.formInputs}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={passsword}
                      onChange={(e) => {
                        setLoginError(false);
                        setPassword(e.target.value);
                      }}
                      placeholder="Enter Password"
                      className={`${classes.formInputs}`}
                    />
                  </div>
                  <div
                    className="items-center flex gap-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <input
                      type="checkbox"
                      className="cursor-pointer rounded-md h-4 w-4"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    <label className="text-xs select-none cursor-pointer">
                      Show Password
                    </label>
                  </div>
                  <button
                    className="bg-orange-700 py-[8px] px-[24px] w-full rounded-md mt-4 hover:bg-orange-900 hover:font-bold"
                    onClick={handleRegister}
                  >
                    Register
                  </button>
                  {loginError && (
                    <div
                      className={`flex items-center gap-3 rounded-md px-[24px] py-[8px] justify-center text-[20px] font-bold ${errorMessage.styling}`}
                    >
                      <CancelRoundedIcon /> {errorMessage.message}
                    </div>
                  )}
                </div>
              </form>
            )}
            <div className="flex text-gray-400 flex-row font-bold py-5 justify-evenly items-center gap-5">
              <hr className="w-full border-gray-500 border-t-2" /> OR{" "}
              <hr className="w-full border-gray-500 border-t-2" />
            </div>
            <div className="space-y-4">
              {/* <button className="bg-blue-600 hover:font-bold hover:bg-blue-900 py-[8px] px-[10px] w-full rounded-md flex items-center justify-center gap-4">
                <img src="/facebook.svg" className="h-6 w-6" />
                Continue with Facebook
              </button> */}
              <button className="bg-red-600 hover:font-bold hover:bg-red-900 py-[8px] w-full rounded-md flex items-center justify-center gap-4">
                <img src="/gmailLogin.png" className="h-5 w-6" />
                Continue with Google
              </button>
            </div>
            <div className="mt-5">
              <span className="text-gray-400">
                {signup ? "Already have an account?" : "Don't have an account?"}
              </span>{" "}
              <button
                className="underline"
                onClick={() => {
                  setLoginError(false);
                  resetForm();
                  setSignup((prev) => !prev);
                }}
              >
                {signup ? "Sign in" : "Sign up"}
              </button>
            </div>
          </div>
          <div className="glassmorphism hidden rounded-md md:flex">
            <h1>Yo</h1>
            <h1>Yo</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
