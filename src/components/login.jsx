import React, { useContext, useEffect, useRef } from "react";
import AppContext from "../context/AppContext";
import "../css/login.css";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const notifyGreen = (val) => toast.success(`${val}`);
  const notifyRed = (val) => {
    toast.error(`${val}`);
  };
  const emailRef = useRef();
  const passwordRef = useRef();

  const {
    loginClicked,
    // notifyRed,
    decoded,
    show,
    toggleButton,
  } = useContext(AppContext)

  const navigate = useNavigate()

  const submitBtnClicked = async (eve) => {
    eve.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value
    // alert(email)
    // if (email === "test@gmail.com") {
    //   if (password === "123") {
    //     navigate("/dashboard")
    //   } else {
    //     notifyRed("Password mismatch! use '123'.")
    //     passwordRef.current.value = ""
    //   }
    // } else {
    //   notifyRed("Uh-oh, use mail as 'test@gmail.com'")
    //   emailRef.current.value = ""
    //   passwordRef.current.value = ""
    // }

      try {
        const response = await axios.post("https://budgetplanner-backend-1.onrender.com/login",{
          email,
          password: password,
        },{
          headers: {
            'Content-Type': 'application/json',
          },
        })

        notifyGreen(response.data.message)
        navigate("/dashboard")
      } catch (error) {
        if(error.response){
          const errorDetails = error.response.data.message
          
          if(errorDetails === "Email incorrect"){
            notifyRed("Email is incorrect")
          }
          else if(errorDetails === "Password incorrect"){
            notifyRed("Password is incorrect")
          }
          else{
            notifyRed("Login failed")
          }
        }
        else{
          notifyRed("Something went wrong...")
        }
        console.error(error)
      }
    }
  useEffect(() => {
    if (decoded) {
      navigate("/dashboard");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decoded]);

  return (
    <>
    <ToastContainer newestOnTop autoClose={2000} />
        <main className="main">
          <div className="loginbox">
            <form className="form">
              <h2 className="loginName">Login</h2>
              <div className="mai">
                <input
                  type="email"
                  name="Email"
                  className="e_mail"
                  placeholder="Enter mail"
                  required
                  ref={emailRef}
                />
              </div>
              <div className="pas">
                <input
                  type={show ? "text" : "password"}
                  name="Password"
                  className="pass"
                  placeholder="Enter password"
                  required
                  ref={passwordRef}
                />
                <span className="show">
                  <i
                    style={{ color: "black", cursor: "pointer" }}
                    className={
                      show ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                    }
                    onClick={toggleButton}
                  ></i>
                </span>
              </div>
              <button type="submit" className="btn" onClick={submitBtnClicked}>
              SignIn
            </button>

              <div className="forgotPass">Forgot password?</div>
              <div className="or">
                <hr className="hr" />
                <h4>OR</h4>
                <hr className="hr" />
              </div>
              <div className="google">
                <GoogleLogin
                  onSuccess={loginClicked}
                  onError={() => {
                    alert("Login Failed");
                  }}
                />
              </div>
              <div className="signUp">
                <h5>Doesn't have an account?</h5>
                <span
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  SignUp
                </span>
              </div>
            </form>
          </div>
        </main>
    </>
  );
}
