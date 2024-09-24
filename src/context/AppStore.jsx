import React, { useState } from "react"
import { toast } from "react-toastify"
import AppContext from "./AppContext"
import axios from "axios"
import { useCookies } from "react-cookie"

const AppStore = (props) => {
  const notifyFalse = (val) => {
    toast.warn(`${val}`)
  }
  const notifyTrue = (val) => toast.success(`${val}`)

  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [spents, setSpents] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [budgetChanged, setBudgetChanged] = useState(false)
  const [amountFromDb, setAmountFromDb] = useState()

  //setCookies
  const [cookies] = useCookies(["userId", "userName"])

  //new here
  const [expenses, setExpenses] = useState([])
  const [loadingInExpensePage, setLoadingInExpensePage] = useState(false)

  const addExpenses = async () => {
    setLoadingInExpensePage(true)
    const parAmount = parseInt(amount)
    if (category !== "") {
      if (amount !== "") {
        const categoryLowerCase = category.toLowerCase()
        try {
          await axios.post(
            `https://budgetplanner-backend-1.onrender.com/users/${cookies.userId}/data`,
            // `http://localhost:8875/users/${cookies.userId}/data`,
            {
              category: categoryLowerCase,
              amount: parAmount,
            }
          )
          setLoadingInExpensePage(false)
        } catch (error) {
          console.error(error)
        } finally {
          setLoadingInExpensePage(false)
        }

        try {
          const response = await axios.get(
            `https://budgetplanner-backend-1.onrender.com/users/${cookies.userId}`,
            // `http://localhost:8875/users/${cookies.userId}`,
            { headers: { "Content-Type": "application/json" } }
          )
          setExpenses(response.data)
        } catch (error) {
          console.error("Error fetching expenses:", error)
        } finally {
          setAmount("")
          setCategory("")
          setLoadingInExpensePage(false)
        }
      } else {
        notifyFalse("Empty amount, you should mention the amount")
        setLoadingInExpensePage(false)
      }
    } else if (category === "") {
      notifyFalse("Empty category, you should mention the category")
      setLoadingInExpensePage(false)
    }
    setLoadingInExpensePage(false)
  }

  async function changeBudget() {
    const changebudget = parseInt(prompt("Enter budget here: ", 5000))
    if (changebudget < 0) {
      notifyFalse("Positive numbers only for your budget! 💰")
    } else {
      setBudgetChanged(true)
      try {
        const response = await axios.post(
          `https://budgetplanner-backend-1.onrender.com/users/${cookies.userId}/budget`,
          // `http://localhost:8875/users/${cookies.userId}/budget`,
          {
            budget: changebudget,
          }
        )
        setBudgetChanged(false)
        notifyTrue(response.data.message)
      } catch (error) {
        console.log("Error getting while changing budget: ", error)
        setBudgetChanged(false)
      } finally {
        setBudgetChanged(false)
      }
    }

    if (Notification.permission === "granted") {
      if (changebudget > amountFromDb) {
        const notification = new Notification("Budget Planner", {
          body: `Budget increased! final budget ${changebudget}`,
        })
        notification.onclick = () => {
          window.focus()
        }
      } else if (changebudget < amountFromDb) {
        const notification = new Notification("Budget Planner", {
          body: `Budget decreased! final budget ${changebudget}`,
        })
        notification.onclick = () => {
          window.focus()
        }
      } else {
        const notification = new Notification("Budget Planner", {
          body: `Budget remains same! final budget ${changebudget}`,
        })
        notification.onclick = () => {
          window.focus()
        }
      }
    }
  }

  const handleKeyPress = (event) => {
    setCategory(event.target.value)
    const keyCode = event.keyCode || event.which
    const keyValue = String.fromCharCode(keyCode)
    if (!/^[A-Za-z\s]+$/.test(keyValue)) {
      event.preventDefault()
    }
    if (event.key === "Enter") {
      if (event.target.id === "category") {
        document.getElementById("amount").focus()
      } else if (event.target.id === "amount") {
        document.getElementById("addBtn").focus()
      }
    }
  }

  function enterKey(eve) {
    if (eve.key === "Enter") {
      if (eve.target.id === "category") {
        document.getElementById("amount").focus()
      } else if (eve.target.id === "amount") {
        document.getElementById("addBtn").focus()
      }
    }
  }
  return (
    <AppContext.Provider
      value={{
        amount,
        setAmount,
        category,
        setCategory,
        spents,
        setSpents,
        remaining,
        setRemaining,
        handleKeyPress,
        changeBudget,
        enterKey,
        expenses,
        addExpenses,
        setExpenses,
        loadingInExpensePage,
        budgetChanged,
        setAmountFromDb,
        amountFromDb,
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}

export default AppStore
