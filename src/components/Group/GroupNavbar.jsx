import React, { useState } from "react"
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

  const logout = () => {
    navigate("/")
  }

  return (
    <>
      <nav className="nav">
        <div className="navbar">
          <div className="expenseTracker">
            <img
              src="https://expense-tracker.iprog.tech/assets/main-logo-4574ab8c0203e45ee4fb8a91459f1337c1659a651c1a5ebcbb80fc5e89897d62.png"
              alt="logo"
              onClick={() => {
                navigate("/")
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
