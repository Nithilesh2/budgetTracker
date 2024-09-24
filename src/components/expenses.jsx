import React, { useContext, useEffect, useState } from "react"
import AppContext from "../context/AppContext"
import "../css/expenses.css"
import Navbar from "./navbar"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import ClipLoader from "react-spinners/ClipLoader"
import { useCookies } from "react-cookie"
import { TailSpin } from "react-loader-spinner"
import { useNavigate } from "react-router-dom"

function Expenses() {
  const {
    category,
    setCategory,
    handleKeyPress,
    amount,
    setAmount,
    enterKey,
    changeBudget,
    spents,
    setSpents,
    remaining,
    setRemaining,
    addExpenses,
    expenses,
    setExpenses,
    budgetChanged,
    loadingInExpensePage,
    amountFromDb,
    setAmountFromDb,
  } = useContext(AppContext)

  const [cookies] = useCookies(["userId", "userName"])
  const navigate = useNavigate()
  //to remove when user is deleted data
  const [deleted, setDeleted] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  useEffect(() => {
    if (cookies.userId === undefined) {
      navigate("/")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.userId])

  useEffect(() => {
    const spent = expenses.reduce((starter, data) => starter + data.amount, 0)
    const remaining = amountFromDb - spent
    setSpents(spent)
    setRemaining(remaining)

    const getSixtyPer = amountFromDb * 0.6
    const getNintyPer = amountFromDb * 0.9

    if (spents <= getSixtyPer) {
      Notification.requestPermission().then(() => {
        const notification = new Notification("Budget Planner", {
          body: `You are in safe 😁`,
        })
        notification.onclick = () => {
          window.focus()
          window.open("https://2024-budgettracker.netlify.app/", "_blank")
        }
      })
    }
    if (spents >= getSixtyPer) {
      alert("You consumed 60% of your expenses")
      Notification.requestPermission().then(() => {
        const notification = new Notification("Budget Planner", {
          body: `You consumed 60% of your budget plan 😟`,
        })
        notification.onclick = () => {
          window.focus()
          window.open("https://2024-budgettracker.netlify.app/", "_blank")
        }
      })
    }
    if (spents >= getNintyPer) {
      alert("You consumed 90% of your expenses")
      Notification.requestPermission().then(() => {
        const notification = new Notification("Budget Planner", {
          body: `You consumed 90% of your budget plan 😰`,
        })
        notification.onclick = () => {
          window.focus()
          window.open("https://2024-budgettracker.netlify.app/", "_blank")
        }
      })
    }
  }, [expenses, setSpents, setRemaining, amountFromDb, spents])

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(() => {
        const notification = new Notification("Budget Planner", {
          body: `Hi there, ${cookies.userName}`,
        })

        notification.onclick = () => {
          window.focus()
          window.location.href = "https://2024-budgettracker.netlify.app/"
        }
      })
    }
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `https://budgetplanner-backend-1.onrender.com/users/${cookies.userId}/`,
          // `http://localhost:8875/users/${cookies.userId}/`,
          { headers: { "Content-Type": "application/json" } }
        )
        setExpenses(response.data)
      } catch (error) {
        console.error("Error fetching expenses:", error)
      }
    }

    const fetchBudget = async () => {
      try {
        const response = await axios.get(
          `https://budgetplanner-backend-1.onrender.com/users/${cookies.userId}/budget`,
          // `http://localhost:8875/users/${cookies.userId}/budget`,
          { headers: { "Content-Type": "application/json" } }
        )
        setAmountFromDb(response.data.budget)
      } catch (error) {
        console.log("Error fetching budget:", error)
      }
    }

    fetchExpenses()
    fetchBudget()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.userId, deleted, budgetChanged])

  const removeExpense = async (dataId) => {
    setLoadingDelete(true)
    try {
      setDeleted(true)
      await axios.delete(
        `https://budgetplanner-backend-1.onrender.com/users/${cookies.userId}/data/${dataId}`
      )
      setDeleted(false)
    } catch (error) {
      console.error("Error deleting expense:", error)
      setDeleted(false)
      setLoadingDelete(false)
    } finally {
      setDeleted(false)
      setLoadingDelete(false)
    }
  }

  return (
    <>
      <main className="mainExpense">
        <Navbar />
        <div className="middle">
          <div className="middleLeft">
            <div className="addData">
              <div className="expenseCategory">
                <input
                  id="category"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  type="text"
                  placeholder="Category"
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="expenseAmount">
                <input
                  id="amount"
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                  type="number"
                  placeholder="Amount"
                  onKeyPress={enterKey}
                />
              </div>
              <div className="expenseAdd">
                {loadingInExpensePage ? (
                  <>
                    <button className="addExpenseBtn">
                      <ClipLoader
                        color="#D898D7"
                        loading={loadingInExpensePage}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={addExpenses}
                    id="addBtn"
                    className="addExpenseBtn"
                  >
                    ADD
                  </button>
                )}

                <ToastContainer newestOnTop autoClose={2000} />
              </div>
            </div>
          </div>
          <div className="vline"></div>
          <hr className="vlineAfter" />

          <div className="middleRight">
            <div className="middleRightTop">
              <div className="budgetBox">
                <span className="showBudget">Budget : ₹{amountFromDb}</span>
                <button onClick={changeBudget} className="changeBudget">
                  <ion-icon name="create-outline"></ion-icon>
                </button>
              </div>
              <div className="remainingBox">
                <div className="showRemaining">Remaining: ₹{remaining}</div>
              </div>
              <div className="spentsBox">
                <div className="showSpents">Spent: ₹{spents}</div>
              </div>
            </div>
            {loadingDelete ? (
              <div
                style={{
                  height: "auto",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: "50%",
                }}
              >
                <TailSpin color="#00BFFF" height={60} width={60} />
              </div>
            ) : (
              ""
            )}
            <div className="middleRightBottom">
              <div className="myExpenses">My Expenses</div>
              <hr className="hr" />
              <ul className="expenseHeading">
                <li>
                  <span className="expenseName">Category</span>
                  <span className="expenseCost">Amount</span>
                  <span className="expenseAction">Delete</span>
                  <span className="expenseDetails">Created</span>
                </li>
              </ul>
              <ul className="expenseData">
                {expenses.length > 0 ? (
                  expenses.map((data) => {
                    return (
                      <li key={data._id}>
                        <span className="expenseName">{data.category}</span>
                        <span className="expenseCost">{data.amount}</span>
                        <span className="expenseAction">
                          <i
                            className="fa-solid fa-trash"
                            onClick={() => removeExpense(data._id)}
                          ></i>
                        </span>
                        <span className="expenseDate">
                          <div className="createdOrUpdated">
                            {data.updatedAt === data.createdAt ? "(C)" : "(E)"}
                          </div>
                          <div className="date">
                            {data.updatedAt
                              ? new Date(data.updatedAt).toLocaleString()
                              : "No Date Available"}
                          </div>
                        </span>
                      </li>
                    )
                  })
                ) : (
                  <div className="emptyExpenses">
                    No spending? Cool! 😎
                    <br /> Forget where your money went? 💸 Try this to track
                    your expenses! 📊
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Expenses
