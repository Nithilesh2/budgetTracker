import React, { useContext, useRef, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import AppContext from "../../context/AppContext"
import ClipLoader from "react-spinners/ClipLoader"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

const CreateGroup = () => {
  const {  setGroupName, setGroupPassword } =
    useContext(AppContext)

  const notifyFalse = (val) => {
    toast.warn(`${val}`)
  }
  const notifyTrue = (val) => toast.success(`${val}`)

  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const groupPasswordRef = useRef()
  const groupNameRef = useRef()

  const navigate = useNavigate()

  const createBtnClicked = async () => {
    const groupName = groupNameRef.current.value
    const groupPassword = groupPasswordRef.current.value

    if (groupName === "") {
      notifyFalse("Group Name cannot be empty")
      return
    } else if (groupPassword === "") {
      notifyFalse("Group Password cannot be empty")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        "https://budgetplanner-backend-1.onrender.com/create-group",
        // "http://localhost:8875/create-group",
        {
          groupName: groupName,
          groupPassword: groupPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      setLoading(false)
      if (response.status === 201) {
        notifyTrue("Creating a new group for you")
        setTimeout(() => {
          notifyTrue("Group created successfully")
        }, 3000)
        setTimeout(() => {
          navigate("/join-group")
        }, 6000)
      }
    } catch (error) {
      if (error.status === 409) {
        setLoading(false)
        notifyFalse("Group already exists")
        setTimeout(() => {
          const askForCreateNewGroup = window.confirm(
            "Would you like to create a new group"
          )
          if (!askForCreateNewGroup) {
            setGroupName(groupName)
            setGroupPassword(groupPassword)
            navigate("/join-group")
          }
        }, 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer newestOnTop autoClose={2000} />
      <main className="main">
        <div className="loginbox">
          <div className="form" style={{ position: "relative" }}>
            <h2
              className="loginName"
              style={{ position: "absolute", top: " 50px" }}
            >
              Create Group
            </h2>
            <div className="mai">
              <input
                type="text"
                name="groupName"
                className="e_mail"
                placeholder="Enter group name"
                required
                ref={groupNameRef}
              />
            </div>
            <div className="pas">
              <input
                type={show ? "text" : "password"}
                name="Password"
                className="pass"
                placeholder="Enter password"
                required
                minLength={10}
                ref={groupPasswordRef}
              />
              <span className="show">
                <i
                  style={{ color: "black", cursor: "pointer" }}
                  className={show ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
                  onClick={()=>setShow(!show)}
                ></i>
              </span>
            </div>
            <button type="submit" className="btn" onClick={createBtnClicked}>
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
                <>Create</>
              )}
            </button>
            <div
              className="joinGroupNavigate"
              style={{
                backgroundColor: "transparent",
                cursor: "default",
                fontWeight: 500,
                position: "relative",
                top: "50px",
              }}
            >
              Already have Group?{" "}
              <Link
                to="/join-group"
                style={{ color: "#F1EFF2", textDecoration: "none" }}
              >
                {" "}
                Join Group
              </Link>
            </div>
            <div
              className="loginNavigate"
              style={{
                backgroundColor: "transparent",
                cursor: "default",
                fontWeight: 500,
                position: "relative",
                top: "50px",
              }}
            >
              Already have an account?
              <Link
                to="/login"
                style={{ color: "#F1EFF2", textDecoration: "none" }}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default CreateGroup
