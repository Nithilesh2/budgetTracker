import React, { useState } from "react"
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom"

const GroupNavbar = () => {
  const navigate = useNavigate()

  const [menu, setMenu] = useState(true)
  const [close, setClose] = useState(false)

  const menuToggled = () => {
    setMenu(false)
    setClose(true)
  }
  const closeToggled = () => {
    setMenu(true)
    setClose(false)
  }

  const [, removeCookie] = useCookies(["userId", "userName"])
  const logout = () => {
    removeCookie("groupId")
    removeCookie("groupName")
    removeCookie("memberId")
    removeCookie("memberName")
    navigate("/join-group")
  }

  return (
    <>
      <nav className="nav">
        <div className="navbar">
          <div className="expenseTracker">
            <img
              src="https://downloadr2.apkmirror.com/wp-content/uploads/2021/01/01/5ffd9b2ead653-384x384.png"
              alt="logo"
              onClick={() => {
                navigate("/dashboard-group")
              }}
            />
          </div>
          <div className={menu ? "navitems-active" : "navitems"}>
            <ul className={menu ? "navData-active" : "navData"}>
              <li>
                <div
                  onClick={() => {
                    navigate("/dashboard-group")
                  }}
                >
                  Dashboard
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    navigate("/track-group")
                  }}
                >
                  Track
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    navigate("/expenses-group")
                  }}
                >
                  Expenses
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    logout()
                  }}
                >
                  Logout
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="menuClose">
          <div className={menu ? "menu" : "menu-active"} onClick={menuToggled}>
            <i className="fa-solid fa-bars"></i>
          </div>
          <div
            className={close ? "close" : "close-active"}
            onClick={closeToggled}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
      </nav>
    </>
  )
}

export default GroupNavbar
