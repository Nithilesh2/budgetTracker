import React, { useContext, useEffect, useState } from "react"
import Navbar from "./navbar"
import "../css/dashboard.css"
import { Bar, Pie } from "react-chartjs-2"
import "chart.js/auto"
import AppContext from "../context/AppContext"
import { useCookies } from "react-cookie"

function Dashboard() {
  const { budget, expenses } = useContext(AppContext)
  const [cookies] = useCookies(["userId", "userName"])
  const [categoryAmount, setCategoryAmount] = useState({})

  useEffect(() => {
    const amountByCategory = {}
    expenses.forEach((data) => {
      if (!amountByCategory[data.category]) {
        amountByCategory[data.category] = 0
      }
      amountByCategory[data.category] += data.amount
    })
    setCategoryAmount(amountByCategory)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses])

  const userData = {
    labels: Object.keys(categoryAmount),
    datasets: [
      {
        label: `Expenses(budget: ${budget})`,
        data: Object.values(categoryAmount),
        backgroundColor: [
          "rgba(219, 112, 147, 0.6)",
          "rgba(230, 230, 250, 0.6)",
          "rgba(255, 192, 203, 0.6)",
          "rgba(240, 128, 128, 0.6)",
          "rgba(218, 112, 214, 0.6)",
          "rgba(147, 112, 219, 0.6)",
        ],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

  return (
    <>
      <main className="mainDashboard">
        <Navbar />
        <div className="totalData">
          <h1 className="greetings">
            {`Welcome back, ${cookies.userName}` || "Welcome back, Guest"}
          </h1>
          <div className="barChart">
            <div className="bar1">
              <Bar
                options={options}
                style={{ width: "200px", height: "250px" }}
                data={userData}
              />
            </div>
            <div className="bar2">
              <Pie
                options={options}
                style={{ width: "200px", height: "250px" }}
                data={userData}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard
