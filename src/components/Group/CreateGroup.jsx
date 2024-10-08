import React, { useContext, useRef } from "react"
import { ToastContainer } from "react-toastify"
import AppContext from "../../context/AppContext"
import ClipLoader from "react-spinners/ClipLoader"
import axios from "axios"
import { Link } from "react-router-dom"

const CreateGroup = () => {
  const { show, toggleButton, loading } = useContext(AppContext)

  const groupPasswordRef = useRef()
  const groupNameRef = useRef()
  const groupUserNameRef = useRef()
  const groupUserPasswordRef = useRef()

  const createBtnClicked = async () => {
    const groupName = groupNameRef.current.value
    const groupPassword = groupPasswordRef.current.value
    // const groupUserName = groupUserNameRef.current.value
    // const groupUserPassword = groupUserPasswordRef.current.value

    const reponse = await axios.post(
      // "https://budgetplanner-backend-1.onrender.com/create-group",
      "http://localhost:8875/create-group",
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

    console.log(reponse.data)
  }

  return (
    <>
      <ToastContainer newestOnTop autoClose={2000} />
      <main className="main">
        <div className="loginbox">
          <div className="form">
            <h2 className="loginName">Create Group</h2>
            <div className="mai">
              <input
                type="text"
                name="userFGroupName"
                className="e_mail"
                placeholder="Enter User name"
                required
                ref={groupUserNameRef}
              />
            </div>
            <div className="mai">
              <input
                type="password"
                name="userFGroupName"
                className="e_mail"
                placeholder="Enter User password"
                required
                ref={groupUserPasswordRef}
              />
            </div>
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
                  onClick={toggleButton}
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
              style={{ backgroundColor: "transparent",cursor: "default",fontWeight: 500 }}
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
