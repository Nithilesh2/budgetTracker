import React, { useContext, useEffect, useState } from "react"
import GroupNavbar from "./GroupNavbar"
import AppContext from "../../context/AppContext"
import ClipLoader from "react-spinners/ClipLoader"
import { toast, ToastContainer } from "react-toastify"
import { TailSpin } from "react-loader-spinner"
import axios from "axios"
import { useCookies } from "react-cookie"
import InitialsAvatar from "react-initials-avatar"

const GroupExpenses = () => {
  const notifyFalse = (val) => {
    toast.warn(`${val}`)
  }
  const notifyTrue = (val) => toast.success(`${val}`)

  const {
    setCategory,
    category,
    handleKeyPress,
    setAmount,
    amount,
    enterKey,
    loadingInExpensePage,
    loadingDelete,
    setGroupExpenses,
    groupExpenses,
    removeExpense,
  } = useContext(AppContext)

  const [cookies] = useCookies(["groupId", "memberId", "memberName"])
  const [totalSpents, setTotalSpents] = useState(0)

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

  const groupAddExpenses = async () => {
    if (category === "") {
      notifyFalse("Please select a category!")
      return
    } else if (category === "") {
      notifyFalse("Please enter an amount!")
      return
    }
    try {
      const cat = category.toLowerCase()
      await axios.post(
        `https://budgetplanner-backend-1.onrender.com/${cookies.groupId}/members/${cookies.memberId}/data`,
        // `http://localhost:8875/${cookies.groupId}/members/${cookies.memberId}/data`,
        {
          category: cat,
          amount: parseInt(amount),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const res = await axios.get(
        `https://budgetplanner-backend-1.onrender.com//${cookies.groupId}/members/data`
        // `http://localhost:8875/${cookies.groupId}/members/data`
      )
      notifyTrue("Category added successfully")
      const membersData = res.data.membersData
      setGroupExpenses(membersData)

      const spents = membersData.reduce((total, member) => {
        return (
          total +
          member.dataByGroupMember.reduce((sum, data) => sum + data.amount, 0)
        )
      }, 0)
      setTotalSpents(spents)
      setCategory("")
      setAmount("")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <main className="mainExpense">
        <GroupNavbar />
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
                    onClick={groupAddExpenses}
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
              <div className="spentsBox">
                <div className="showSpents">Group Spents: ₹{totalSpents}</div>
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
                  <span className="expenseCost">Amo</span>
                  <span className="expenseAction">Del</span>
                  <span className="expenseAction">User</span>
                  <span className="expenseDetails">Created</span>
                </li>
              </ul>
              <ul className="expenseData">
                {groupExpenses.length > 0 ? (
                  groupExpenses.map((memberData) => {
                    return memberData.dataByGroupMember.map((data) => (
                      <li key={data._id} style={{ marginLeft: "0px" }}>
                        <span
                          className="expenseName"
                          style={{
                            overflowWrap: "break-word",
                            maxWidth: "20%",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {data.category}
                        </span>
                        <span className="expenseCost">{data.amount}</span>
                        <span className="expenseAction">
                          {memberData.memberName === cookies.memberName ? (
                            <i
                              className="fa-solid fa-trash"
                              onClick={() => removeExpense(data._id)}
                            ></i>
                          ) : (
                            ""
                          )}
                        </span>
                        <span className="expenseAction">
                          <InitialsAvatar name={memberData.memberName} />
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
                    ))
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

export default GroupExpenses
