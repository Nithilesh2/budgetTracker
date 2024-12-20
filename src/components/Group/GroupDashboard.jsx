import React, { useContext, useEffect } from "react"
import GroupNavbar from "./GroupNavbar"
import { Bar } from "react-chartjs-2"
import AppContext from "../../context/AppContext"
import axios from "axios"
import { useCookies } from "react-cookie"

const GroupDashboard = () => {
  const {
    sortedData,
    setGroupExpenses,
    setTotalSpents,
    setSortedData,
    groupExpenses,
  } = useContext(AppContext)

  const [cookies] = useCookies(["groupId", "memberId", "memberName"])

  const category = sortedData.map((data) => data.category)
  const amount = sortedData.map((data) => data.amount)


  const userData = {
    labels: category,
    datasets: [
      {
        label: `Group Expenses`,
        data: amount,
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

  useEffect(() => {
    const fetchGroupExpenses = async () => {
      try {
        const response = await axios.get(
          `https://budgetplanner-backend-1.onrender.com/${cookies.groupId}/members/data`
          // `http://localhost:8875/${cookies.groupId}/members/data`
        )
        const membersData = response.data.membersData
        setGroupExpenses(membersData)

        const spents = membersData.reduce((total, member) => {
          return (
            total +
            member.dataByGroupMember.reduce((sum, data) => sum + data.amount, 0)
          )
        }, 0)
        setTotalSpents(spents)
      } catch (error) {
        console.error(error)
      }
    }

    fetchGroupExpenses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.groupId, setGroupExpenses])


  useEffect(() => {
    const sortedDate = (membersData) => {
      return membersData.reduce((acc, member) => {
        const withMemberName = member.dataByGroupMember.map((data) => ({
          ...data,
          memberName: member.memberName,
        }))

        const a = acc.concat(withMemberName)
        return a.sort((y, z) => new Date(y.createdAt) - new Date(z.createdAt))
      }, [])
    }

    const empArr = sortedDate(groupExpenses)
    setSortedData(empArr)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupExpenses])

  return (
    <>
      <main className="mainExpense">
        <GroupNavbar />
        <h1 className="greetings">
            {`Welcome back, ${cookies.memberName}` || "Welcome back, Guest"}
          </h1>

        <div className="bar1">
          <Bar
            options={options}
            style={{ width: "200px", height: "250px" }}
            data={userData}
          />
        </div>
      </main>
    </>
  )
}

export default GroupDashboard
