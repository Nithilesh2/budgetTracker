import React, { useState } from "react";
import "../css/signup.css";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"

export default function SignUp() {
  const notifyGreen = (val) => toast.success(`${val}`);
  const notifyYellow = (val) => toast.warn(`${val}`);
  const notifyRed = (val) => {
    toast.error(`${val}`);
  };
  const navigate = useNavigate();
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{7,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState(0);
  const [confirmPass, setConfirmPass] = useState(0);

  const emailChanging = (eve) => {
    const roundColor = document.querySelector(".checkmail");
    setEmail(eve.target.value);
    if (eve.target.value === "") {
      roundColor.style.color = "grey";
    } else if (!emailRegex.test(email)) {
      roundColor.style.color = "red";
    } else {
      roundColor.style.color = "green";
    }
  };
  const passwordChanging = (eve) => {
    const roundColor = document.querySelector(".checkpas");
    setPass(eve.target.value);
    if (eve.target.value === "") {
      roundColor.style.color = "grey";
    } else if (!passRegex.test(pass)) {
      roundColor.style.color = "red";
    } else {
      roundColor.style.color = "green";
    }
  };
  const rePasswordChanging = (eve) => {
    const roundColor = document.querySelector(".recheckpas");
    setConfirmPass(eve.target.value);
    if (eve.target.value === "") {
      roundColor.style.color = "grey";
    } else if (!passRegex.test(confirmPass)) {
      roundColor.style.color = "red";
    } else {
      roundColor.style.color = "green";
    }
  };
  const signupbtnClicked = async(event) => {
    event.preventDefault();
    if (email === "") {
      notifyRed("Email is empty");
    } else if (pass === 0) {
      notifyRed("Enter password");
    } else if (confirmPass === 0) {
      notifyRed("Enter confirm password");
    } else if (pass !== confirmPass) {
      notifyYellow("Password and Confirm password not matches");
    } else {
      if (!emailRegex.test(email)) {
        notifyYellow("Enter correct email address");
      } else if (!passRegex.test(pass)) {
        notifyYellow("Not Strong password");
      } else if (!passRegex.test(confirmPass)) {
        notifyYellow("Not Strong Confirm password");
      } else {
        try {
          const response = await axios.post("https://budgetplanner-backend-1.onrender.com/signup",{
            email,
            password: pass,
            RePassword: confirmPass
          },{
            headers: {
              'Content-Type': 'application/json',
            },
          })

          notifyGreen(response.data.message || "User registered successfully!");
          setTimeout(() => {
            navigate('/');
          }, 2000);
          
        } catch (error) {
          console.error("Error",error)
          notifyRed("Error signing up, please try again.");
        }
        // finally{
        //   notifyGreen(
        //     "Got your credentials🥳 Bingo! You're now part of the family. Cheers! 🥂"
        //   );
        //   navigate('/');
        // }
      }
    }
  };

  return (
    <main className="main">
      <div className="loginbox">
        <form className="form" method="post" action="server.js">
          <h2 className="SignUp">SignUp</h2>

          <div className="mai">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter mail"
              required
              onChange={emailChanging}
            />
            <span className="checkmail">
              <i className="fa-solid fa-circle"></i>
            </span>
          </div>

          <div className="pas">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              required
              onChange={passwordChanging}
            />
            <span className="checkpas">
              <i className="fa-solid fa-circle"></i>
            </span>
          </div>

          <div className="repas">
            <input
              type="password"
              name="RePassword"
              id="rePassword"
              placeholder="Confirm password"
              required
              onChange={rePasswordChanging}
            />
            <span className="recheckpas">
              <i className="fa-solid fa-circle"></i>
            </span>
          </div>
          <button
            name="submit"
            type="submit"
            onClick={signupbtnClicked}
            id="button"
          >
            Sign Up
          </button>
          <ToastContainer newestOnTop autoClose={2000} />
          <div className="or">
            <hr className="hr" />
            <h4>OR</h4>
            <hr className="hr" />
          </div>
          <div className="google">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(credentialResponse.credential);
                console.log(decoded);
              }}
              onError={() => {
                alert("Login Failed");
              }}
            />
          </div>
          <div className="logIn">
            <h5>Already have any account?</h5>
            <div
              className="allogin"
              onClick={() => {
                navigate("/");
              }}
            >
              Login
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
