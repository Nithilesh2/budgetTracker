import React, { useContext, useRef, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import AppContext from "../../context/AppContext"
import ClipLoader from "react-spinners/ClipLoader"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"

const CreateGroup = () => {
  const { groupName, groupPassword } = useContext(AppContext)

  const notifyFalse = (val) => {
    toast.warn(`${val}`)
  }
  const notifyTrue = (val) => toast.success(`${val}`)
  const navigate = useNavigate()

  const groupPasswordRef = useRef()
  const groupNameRef = useRef()
  const groupUserNameRef = useRef()
  const groupUserPasswordRef = useRef()

  const [showGroupPassword, setShowGroupPassword] = useState(false)
  const [showUserPassword, setShowUserPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [, setCookies] = useCookies([
    "userId",
    "userName",
    "groupId",
    "groupName",
  ])

  const joinBtnClicked = async () => {
    const groupNames = groupNameRef.current.value
    const groupPassword = groupPasswordRef.current.value
    const groupUserName = groupUserNameRef.current.value
    const groupUserPassword = groupUserPasswordRef.current.value

    if (groupNames === "") {
      notifyFalse("Group name is required")
      return
    } else if (groupPassword === "") {
      notifyFalse("Group password is required")
      return
    } else if (groupUserName === "") {
      notifyFalse("Group member's name is required")
      return
    } else if (groupUserPassword === "") {
      notifyFalse("Group member's password is required")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        "https://budgetplanner-backend-1.onrender.com/join-group",
        // "http://localhost:8875/join-group",
        {
          groupName: groupNames,
          groupPassword,
          groupMembers: groupUserName,
          groupMembersPassword: groupUserPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      setLoading(false)
      if (response.status === 200) {
        notifyTrue("Group joined successfully")
        setTimeout(() => {
          navigate("/dashboard-group")
        }, 2000)
      }
      const { userId, userName, groupName, groupId } = response.data
      if (userId) {
        setCookies("memberId", userId, {
          path: "/",
          maxAge: 600,
          sameSite: "strict",
        })
      }
      if (userName) {
        setCookies("memberName", userName, {
          path: "/",
          maxAge: 600,
          sameSite: "strict",
        })
      }
      if (groupName) {
        setCookies("groupId", groupId, {
          path: "/",
          maxAge: 600,
          sameSite: "strict",
        })
      }
      if (groupId) {
        setCookies("groupName", groupName, {
          path: "/",
          maxAge: 600,
          sameSite: "strict",
        })
      }
    } catch (error) {
      console.error("Error Data:", error.response.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer newestOnTop autoClose={2000} />
      <main className="main">
        <div className="loginbox">
          <div className="form">
            <h2 className="loginName">Join Group</h2>
            <div className="mai">
              <input
                type="text"
                name="userGroupName"
                className="e_mail"
                placeholder="Enter User name"
                required
                ref={groupUserNameRef}
              />
            </div>

            <div className="mai">
              <input
                type={showUserPassword ? "text" : "password"}
                name="userGroupName"
                className="e_mail"
                placeholder="Enter User Password"
                required
                ref={groupUserPasswordRef}
              />
              <span className="show">
                <i
                  style={{ color: "black", cursor: "pointer" }}
                  className={
                    showUserPassword
                      ? "fa-solid fa-eye-slash"
                      : "fa-solid fa-eye"
                  }
                  onClick={() => setShowUserPassword(!showUserPassword)}
                ></i>
              </span>
            </div>

            <div className="mai">
              <input
                value={groupName}
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
                value={groupPassword}
                type={showGroupPassword ? "text" : "password"}
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
                  className={
                    showGroupPassword
                      ? "fa-solid fa-eye-slash"
                      : "fa-solid fa-eye"
                  }
                  onClick={() => setShowGroupPassword(!showGroupPassword)}
                ></i>
              </span>
            </div>
            <button type="submit" className="btn" onClick={joinBtnClicked}>
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
                <>Join</>
              )}
            </button>
            <div
              className="createGroupNavigate"
              style={{
                backgroundColor: "transparent",
                cursor: "default",
                fontWeight: 500,
              }}
            >
              Don't have Group?{" "}
              <Link
                to="/create-group"
                style={{ color: "#F1EFF2", textDecoration: "none" }}
              >
                {" "}
                Create Group
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
