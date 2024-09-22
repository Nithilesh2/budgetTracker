import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AppContext from "./AppContext"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

const AppStore = (props) => {
  const notifyFalse = (val) => {
    toast.warn(`${val}`)
  }
  const notifyTrue = (val) => toast.success(`${val}`)

  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [spents, setSpents] = useState(0)
  const [budget, setBudget] = useState(500)
  const [remaining, setRemaining] = useState(0)
  const [catData, setCatData] = useState([])
  const [amoData, setAmoData] = useState([])
  const [decoded, setDecoded] = useState("")
  // const [decodedName, setDecodedName] = useState("")
  const [merge, setMerge] = useState({})
  const [dateCreated, setDateCreated] = useState([])

  // const [userId, setUserId] = useState(localStorage.getItem("userId") || null)

  const initializeMergeState = () => {
    const savedMerge = localStorage.getItem("merge")
    if (savedMerge) {
      const parsedMerge = JSON.parse(savedMerge)
      setMerge(parsedMerge)
    } else {
      setMerge({})
    }
  }

  useEffect(() => {
    initializeMergeState()
    const savedCategory = localStorage.getItem("Category")
    if (savedCategory) {
      setCatData(JSON.parse(savedCategory))
    }
    const savedAmount = localStorage.getItem("Amount")
    if (savedAmount) {
      setAmoData(JSON.parse(savedAmount))
    }
    const savedDateCreated = localStorage.getItem("DateCreated")
    if (savedDateCreated) {
      setDateCreated(JSON.parse(savedDateCreated))
    }
    const savedBudget = localStorage.getItem("Budget")
    if (savedBudget) {
      setBudget(parseFloat(savedBudget))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("merge", JSON.stringify(merge))
    localStorage.setItem("Category", JSON.stringify(catData))
    localStorage.setItem("Amount", JSON.stringify(amoData))
    localStorage.setItem("Budget", budget)
    localStorage.setItem("DateCreated", JSON.stringify(dateCreated))
  }, [merge, catData, amoData, budget, dateCreated])

  useEffect(() => {
    if (catData.length > 0 && amoData.length > 0) {
      setMerge(mergeArrays(catData, amoData, dateCreated))
      setSpents(amoData.reduce((acc, cur) => acc + parseInt(cur), 0))
      setRemaining(
        parseFloat(budget) -
          amoData.reduce((acc, cur) => acc + parseFloat(cur), 0)
      )
    }
  }, [catData, amoData, budget, dateCreated])

  const mergeArrays = (cats, amos, dates) => {
    const merged = {}
    for (let i = 0; i < cats.length; i++) {
      merged[cats[i]] = {
        amount: amos[i],
        date: dates[i],
      }
    }
    return merged
  }

  function AddExpenses(category, amount) {
    if (budget === 0) {
      notifyFalse("💵 Budget is null")
    } else {
      if (category === "") {
        notifyFalse("🚫 Empty category detected!")
      } else if (amount === "") {
        notifyFalse("🚫 Empty amount detected!")
      } else if (amount < 0) {
        notifyFalse("🚫 Amount should be positive")
      } else {
        const currentDate = new Date()
        const categoryIndex = catData.findIndex((cat) => cat === category)
        if (categoryIndex !== -1) {
          setAmoData((prevAmoData) => {
            const newAmoData = [...prevAmoData]
            newAmoData[categoryIndex] = (
              parseInt(newAmoData[categoryIndex]) + parseInt(amount)
            ).toString()
            return newAmoData
          })
          setDateCreated((prevDateCreated) => {
            const newDateCreated = [...prevDateCreated]
            newDateCreated[categoryIndex] = currentDate
            return newDateCreated
          })
        } else {
          setCatData((prevCatData) => [...prevCatData, category])
          setAmoData((prevAmoData) => [...prevAmoData, amount])
          setDateCreated((prevDateCreated) => [...prevDateCreated, currentDate])
        }
        setCategory("")
        setAmount("")
        notifyTrue("💵 Wallet-friendly vibes! Another entry safely recorded.")
      }
    }
  }

  //new here
  const userId = localStorage.getItem("userId")
  const [expenses, setExpenses] = useState([])

  const addExpenses = async () => {
    const parAmount = parseInt(amount)
    const categoryLowerCase = category.toLowerCase()
    try {
      await axios.post(
        `https://budgetplanner-backend-1.onrender.com/users/${userId}/data`,
        {
          category: categoryLowerCase,
          amount: parAmount,
        }
      )
    } catch (error) {
      console.error(error)
    }

    try {
      const response = await axios.get(
        `https://budgetplanner-backend-1.onrender.com/users/${userId}`,
        { headers: { "Content-Type": "application/json" } }
      )
      setExpenses(response.data)
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setAmount("")
      setCategory("")
    }
  }

  const deleteItem = (itemName) => {
    const itemIndex = catData.indexOf(itemName)
    if (itemIndex !== -1) {
      const newCatData = [...catData]
      const newAmoData = [...amoData]
      const newDateCreated = [...dateCreated]
      newCatData.splice(itemIndex, 1)
      newAmoData.splice(itemIndex, 1)
      newDateCreated.splice(itemIndex, 1)
      setCatData(newCatData)
      setAmoData(newAmoData)
      setDateCreated(newDateCreated)
      setMerge((prevMerge) => {
        const newMerge = { ...prevMerge }
        delete newMerge[itemName]
        return newMerge
      })
      if (newAmoData.length === 0) {
        setSpents(0)
        setRemaining(budget)
      }
      notifyTrue("Data deleted successfully!")
    } else {
      notifyFalse("Data not found!")
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }
    return date.toLocaleString("en-IN", options)
  }

  function changeBudget() {
    const changebudget = parseInt(prompt("Enter budget here: ", 5000))
    if (changebudget < 0) {
      notifyFalse("Positive numbers only for your budget! 💰")
    } else {
      setBudget(changebudget)
      if (changebudget > budget) {
        notifyTrue("Budget increased successfully! 💰💼")
      } else if (changebudget < budget) {
        notifyTrue("Budget decreased successfully! 💰💼")
      } else {
        notifyTrue("Budget remains same! 💰💼")
      }
    }

    if (Notification.permission === "granted") {
      if (changebudget > budget) {
        const notification = new Notification("Budget Planner", {
          body: `Budget increased! final budget ${changebudget}`,
        })
        notification.onclick = () => {
          window.focus()
        }
      } else if (changebudget < budget) {
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
        AddExpenses(category, amount)
        document.getElementById("category").focus()
      }
    }
  }

  function loginClicked(credentialResponse) {
    let decode = jwtDecode(credentialResponse.credential)
    let userName = decode.name
    setDecoded(userName)
  }

  function enterKey(eve) {
    if (eve.key === "Enter") {
      if (eve.target.id === "category") {
        document.getElementById("amount").focus()
      } else if (eve.target.id === "amount") {
        AddExpenses(category, amount)
        document.getElementById("category").focus()
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
        budget,
        setBudget,
        remaining,
        setRemaining,
        catData,
        setCatData,
        amoData,
        setAmoData,
        merge,
        setMerge,
        AddExpenses,
        deleteItem,
        handleKeyPress,
        changeBudget,
        decoded,
        setDecoded,
        loginClicked,
        formatDate,
        enterKey,
        expenses,
        addExpenses,
        setExpenses,
        // userId,
        // setUserId,
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}

export default AppStore
