import React, { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";
import "../css/login.css";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  // const emailRef = useRef();
  // const passwordRef = useRef();
  // const [decodedName, setDecodedName] = useState("");
  // const [decoded, setDecoded] = useState("");
  // const [show, setShow] = useState(false);
  // const navigate = useNavigate();
  // const toggleButton = () => {
  //   setShow(!show);
  // };

  // const buttonClicked = () => {
  //   if (emailRef.current.value !== "test@gmail.com") {
  //     alert("Use mail => test@gmail.com");
  //   } else if (passwordRef.current.value !== "123") {
  //     alert("Use password => 123");
  //   } else {
  //     navigate("/dashboard");
  //   }
  // };
  // function loginClicked(credentialResponse) {
  //   let decode = jwtDecode(credentialResponse.credential);
  //   var userName = decode.name;
  //   setDecoded(userName);
  // }

  const {
    loginClicked,
    emailRef,
    passwordRef,
    notifyRed,
    decoded,
    show,
    toggleButton,
  } = useContext(AppContext)

  const navigate = useNavigate()

  const submitBtnClicked = () => {
    const email = emailRef.current.value
    const password = passwordRef.current.value
    if (email === "test@gmail.com") {
      if (password === "123") {
        navigate("/dashboard")
      } else {
        notifyRed("Password mismatch! use '123'.")
        passwordRef.current.value = ""
      }
    } else {
      notifyRed("Uh-oh, use mail as 'test@gmail.com'")
      emailRef.current.value = ""
      passwordRef.current.value = ""
    }
  }
  useEffect(() => {
    if (decoded) {
      navigate("/dashboard");
    }
  }, [decoded, navigate]);

  return (
    <>

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
