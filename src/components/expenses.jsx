import React, { useContext, useEffect, useState } from "react"
import AppContext from "../context/AppContext"
import "../css/expenses.css"
import Navbar from "./navbar"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"

function Expenses() {
  const {
    setCategory,
    category,
    handleKeyPress,
    setAmount,
    amount,
    enterKey,
    budget,
    changeBudget,
    spents,
    remaining,
    addExpenses,
    expenses,
    setExpenses,
  } = useContext(AppContext)

  const userId = localStorage.getItem("userId")
  const userName = localStorage.getItem("userName")
  //to remove when user is deleted data
  const [deleted, setDeleted] = useState(false)

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        const notification = new Notification("Budget Planner",{
          body: `Hi there, ${userName}`,
        })

        notification.onclick =()=>{
          window.focus()
        }
      })
    }
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `https://budgetplanner-backend-1.onrender.com/users/${userId}`,
          { headers: { "Content-Type": "application/json" } }
        )
        setExpenses(response.data)
      } catch (error) {
        console.error("Error fetching expenses:", error)
      }
    }

    fetchExpenses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, deleted])

  const removeExpense = async (dataId) => {
    try {
      setDeleted(true)
      await axios.delete(
        `https://budgetplanner-backend-1.onrender.com/users/${userId}/data/${dataId}`
      )
      setDeleted(false)
    } catch (error) {
      console.error("Error deleting expense:", error)
    } finally {
      setDeleted(false)
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
                <button onClick={addExpenses} className="addExpenseBtn">
                  ADD
                </button>
                <ToastContainer newestOnTop autoClose={2000} />
              </div>
            </div>
          </div>
          <div className="vline"></div>
          <hr className="vlineAfter" />
          <div className="middleRight">
            <div className="middleRightTop">
              <div className="budgetBox">
                <span className="showBudget">Budget : ₹{budget}</span>
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
