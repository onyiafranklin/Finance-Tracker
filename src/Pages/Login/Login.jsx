import React, { useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Assets/img/logo-white.svg";
import googleLogo from "../../Assets/img/google.svg";
import Input from "./../../Components/Input/Input";
import Error from "./../../Components/Input/Error";
import Label from "./../../Components/Input/Label";
import Message from '../../Components/Message/Message';
import { useAuth } from "../../Context/AuthContext/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import LoginSpinner from '../../Components/Spinner/LoginSpinner';
import { PATHS, bookHubClientID, bookHubURL, bookHubCodeChallange, redirectURI } from "../../Routes/url";


function Login() {
  const nameRef = useRef();
  const passwordRef = useRef();

  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [status, setStatus] = useState("normal");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [oauthSuccess, setOauthSuccess] = useState(false);

  const { postData, setToken, setLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleName = (e) => {
    if (nameRef.current.value.trim() === "") {
      setNameError(() => "Name is required");
    } else {
      setNameError(() => "");
    }
  }

  const handlePassword = (e) => {
    if (passwordRef.current.value.trim() === "") {
      setPasswordError(() => "Password is required");
    } else {
      setPasswordError(() => "");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(() => "loading");
    setSuccess(() => false);
    let bug = false;
    
    if (passwordRef.current.value.trim() === "") {
      passwordRef.current.focus();
      setPasswordError(() => "Password is required");
      bug = true;
    } else {
      setPasswordError(() => "");
    }

    if (nameRef.current.value.trim() === "") {
      nameRef.current.focus();
      setNameError(() => "Username is required");
      bug = true;
    } else {
      setNameError(() => "");
    }

    if (bug) { // Check for any error
      setStatus(() => "normal");
      return;
    }

    const data = {
      username: nameRef.current.value.trim(),
      password: passwordRef.current.value.trim(),
    }

    try {
      // Send request and await response
      const response = await postData(data, PATHS.login);

      if (response.status === 200) { // Successfully created
        setSuccess(() => true);
        setMessage(() => "Login successful!");

        setStatus(() => "normal");
        nameRef.current.value = "";
        passwordRef.current.value = "";

        const token = response.data.token;
        // Storing token
        localStorage.setItem("token", token);
        setToken(() => token);
        
        // Set LoggedIn state
        setLoggedIn(() => true);

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/dashboard", {replace: true});
        }, 2000);
      }
    } catch(error) {
        setError(() => `Invalid username or password`)  
    }

    setStatus(() => "normal");
  }

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const data = {
        "code": codeResponse.code
      }

      setOauthSuccess(() => true);

      try {
        const response = await postData(data, PATHS.googleOAUTH);

        if (response.status === 200) {
          setSuccess(() => true);
          setMessage("Login successful!");

          const token = response.data.token;
          // Storing token
          localStorage.setItem("token", token);
          setToken(() => token);
          
          // Set LoggedIn state
          setLoggedIn(() => true);
          navigate("/dashboard", {replace: true});
        }
      } catch(error) {
        setOauthSuccess(() => false);
        setError("An error occured, try again.");
        setStatus(() => "normal");
      }
    },
    onError: () => {
      setStatus(() => "normal");
      setError("An error occured, try again.");
    },
    flow: "auth-code"
  });

  const loginBookhub = () => {
    // consolebaseURL
    const url = `${bookHubURL}/oauth/authorize/?response_type=code&code_challenge=${bookHubCodeChallange}&code_challenge_method=S256&client_id=${bookHubClientID}&redirect_uri=${redirectURI}&scope=read`;
    // console.log(url);
    window.location.replace(url);
    setStatus(() => "normal");
  };

  return (
    <>
      {
        oauthSuccess ? (
          <LoginSpinner />
        ) : (
          <>
            <aside id="content" className="w-full bg-zinc-20 bg-primary">
              <div className="container mx-auto pt-8 pb-24 sm:py-16 sm:pb-20 flex items-center justify-center">
                <Link to="/">
                    <img src={logo} alt="Logo for FinTrack" />
                </Link>
              </div>
            </aside>

            <section id="formWrapper" className="w-full">
              <div className="container mx-auto py-10 flex flex-col lg:flex-row">
                <article className="w-full flex justify-center items-center py-10">
                  <div className="bg-white -mt-32 rounded-xl p-6 max-w-3xl w-full space-y-2 flex flex-col 
                      items-center drop-shadow-lg sm:p-10 sm:py-12 md:mx-0">

                      <div className="flex flex-col justify-center w-full">
                        <h1 className="font-serif text-[40px] text-center font-bold text-black mb-10">
                          Login
                        </h1>

                        <div className="flex items-start gap-x-16">
                          <div className="w-1/2 pr-6 border-r self-stretch border-zinc-100 ">
                            <p className="text-lg text-black mb-4">
                              Using social networking accounts
                            </p>

                            <div className="flex flex-col gap-4">
                              <button onClick={() => {
                                setStatus(() => "loading");
                                login();
                              }} className="group text-google text-xl py-3 px-5 rounded-md 
                                  border border-google flex items-center gap-6 w-max">
                                <img src={googleLogo} className="h-6 w-6 transition-transform" alt="Google logo" />
                                <span className="group-hover:underline">Login with Google</span>
                              </button>

                              <button onClick={() => {
                                setStatus(() => "loading");
                                loginBookhub();
                              }} className="group text-bookhub bg-white text-lg py-3 px-8 rounded-md flex items-center 
                                  gap-6 w-max border hover:border-bookhub shadow-md hover:shadow-none"
                                  disabled={status === "loading"}>
                                <span className="group-hover:underline">Login with FastWallet</span>
                              </button>
                            </div>
                          </div>

                          <article className="w-1/2 flex flex-col items-center px-4 md:px-0 lg:items-start">
                            <form onSubmit={handleSubmit} id="login-form" method="post" className="w-full space-y-4 sm:space-y-4">
                              {
                                /** Error message */
                                error && (
                                  <Message type="error" message={error} status={true} />
                                )
                              }
                              <div className="flex flex-col space-y-2">
                                <Label htmlFor="username" text="Username" />
                                <div>
                                  <Input type="text" disabled={status === "loading"} placeholder="Username" name="username" id="username" reff={nameRef} handleChange={handleName} error={nameError !== ""} />
                                  <Error active={nameError} text={nameError} />
                                </div>
                              </div>
                              <div className="flex flex-col space-y-2">
                                  <Label htmlFor="password" text="Password" />
                                <div>
                                  <Input type="password" disabled={status === "loading"} placeholder="Password" name="password" id="password" reff={passwordRef} handleChange={handlePassword} error={passwordError !== ""} />
                                  <Error active={passwordError} text={passwordError} />
                                </div>
                              </div>
                              <div className="flex justify-center mt-8 sm:mt-10">
                                <button type="submit" disabled={status === "loading"}
                                    className="flex flex-row items-center text-base font-semibold px-5 py-4 bg-primary rounded-md w-full justify-center
                                      text-white gap-x-2 drop-shadow-lg disabled:opacity-50 disabled:cursor-not-allowed outline-offset-2 outline-primary outline-1 focus:outline
                                      active:drop-shadow-none hover:underline hover:bg-primaryLight">
                                  <span className={`text-lg sm:text-xl`}>{status === "loading" ? "Logging in...." : "Login"}</span>
                                </button>
                              </div>
                            </form>

                            <Link to="/signup" className="text-lg text-black mt-5 group">
                              Don't have an account? <span className="text-primary group-hover:underline">Register</span>
                            </Link>
                          </article>
                        </div>
                      </div>

                  </div>
                </article>
              </div>
            </section>

            {
              success && (
                <div className="fixed left-4 bottom-4 flex flex-col space-y-4 z-10">
                  <Message type="success" message={message} status={success} />
                </div>
              )
            }
          </>
        )
      }
    </>
  )
}

export default Login;