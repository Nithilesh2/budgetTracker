import React, { useEffect } from "react";
// import AppContext from "../context/AppContext";
import "../css/login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [decoded, setDecoded] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const toggleButton = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (decoded) {
      navigate("/dashboard");
    }
  }, [decoded, navigate]);

  function loginClicked(credentialResponse) {
    let name = jwtDecode(credentialResponse.credential).name;
    let n = name;
    setDecoded(n);
  }
  // console.log(decoded);

  return (
    <>
      {/* <AppContext.Provider value={{ decoded, setDecoded }}> */}
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
                />
              </div>
              <div className="pas">
                <input
                  type={show ? "text" : "password"}
                  name="Password"
                  className="pass"
                  placeholder="Enter password"
                  required
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
              <button
                onClick={() => navigate("/dashboard")}
                type="submit"
                className="btn"
              >
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
      {/* </AppContext.Provider> */}
    </>
  );
}
