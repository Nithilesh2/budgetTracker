import React, { useRef, useState } from "react"
import "../css/login.css"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { ToastContainer, toast } from "react-toastify"
import ClipLoader from "react-spinners/ClipLoader"
import { useCookies } from "react-cookie"
import { jwtDecode } from "jwt-decode"

export default function Login() {
  const notifyGreen = (val) => toast.success(`${val}`)
  const notifyRed = (val) => {
    toast.error(`${val}`)
  }
  const emailRef = useRef()
  const passwordRef = useRef()

  const [, setCookies] = useCookies(["userId", "userName"])

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleSuccess = async (res) => {
    const token = res.credential

    const decoded = jwtDecode(token)
    const email = decoded.email

    try {
      setLoading(true)
      const response = await axios.post(
        "https://budgetplanner-backend-1.onrender.com/googleLogin",
        // "http://localhost:8875/googleLogin",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const { userId, name } = response.data
      if (userId) {
        setCookies("userId", userId, {
          path: "/",
          maxAge: 600,
          sameSite: "strict",
        })
      }
      if (name) {
        setCookies("userName", name, {
          path: "/",
          maxAge: 600,
          sameSite: "strict",
        })
      }
      notifyGreen(response.data.message)
      navigate("/dashboard")
    } catch (error) {
      if (error.response) {
        notifyRed(error.response.data.message)
        setTimeout(() => {
          navigate("/signup")
        }, 3000)
      } else {
        notifyRed("Something went wrong...")
      }
    } finally {
      setLoading(false)
    }
  }

  const submitBtnClicked = async (eve) => {
    eve.preventDefault()
    setTimeout(() => {
      notifyRed(
        "🔒 Please note that logging in may take some time due to server limitations."
      )
    }, 5000)

    const email = emailRef.current.value
    const password = passwordRef.current.value
    try {
      setLoading(true)
      const response = await axios.post(
        "https://budgetplanner-backend-1.onrender.com/login",
        // "http://localhost:8875/login",
        {
          email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const { userId, name } = response.data
      if (userId) {
        setCookies("userId", userId, {
          path: "/",
          maxAge: 600,
          sameSite: "strict",
        })
      }
      if (name) {
        setCookies("userName", name, {
          path: "/",
          maxAge: 600,
          sameSite: "strict",
        })
      }
      setLoading(false)
      notifyGreen(response.data.message)
      navigate("/dashboard")
    } catch (error) {
      if (error.response) {
        notifyRed(error.response.data.message)
      } else {
        notifyRed("Something went wrong...")
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleButton = () => {
    setShow(!show)
  }

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
                  className={show ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
                  onClick={toggleButton}
                ></i>
              </span>
            </div>
            <button type="submit" className="btn" onClick={submitBtnClicked}>
              {loading ? (
                <>
                  <ClipLoader
                    color="#D898D7"
                    loading={loading}
                    size={25}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </>
              ) : (
                <>SignIn</>
              )}
            </button>

            {/* <div className="forgotPass">Forgot password?</div> */}
            <div className="or">
              <hr className="hr" />
              <h4>OR</h4>
              <hr className="hr" />
            </div>
            <div className="google">
              <GoogleLogin
                //edit later onsuccess
                onSuccess={handleSuccess}
                onError={() => {
                  alert("Login Failed")
                }}
              />
            </div>
            <div className="signUp">
              <h5>Doesn't have an account?</h5>
              <Link style={{ color: "#F1EFF2" }} to="/signup">
                SignUp
              </Link>
            </div>
            <div className="newFeature">
              <Link to="create-group">
                Try our new group feature! 🎉 Join groups and manage shared
                expenses easily.
              </Link>{" "}
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
