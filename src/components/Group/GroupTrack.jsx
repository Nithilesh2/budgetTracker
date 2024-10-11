import React, { useContext, useEffect } from "react"
import { ToastContainer } from "react-toastify"
import styles from "./GroupCss/GroupTrack.module.css"
import GroupNavbar from "./GroupNavbar"
import AppContext from "../../context/AppContext"
import axios from "axios"
import { useCookies } from "react-cookie"

const Track = () => {
  const {
    setSearch,
    search,
    setAmount,
    amount,
    handleKeyPress,
    enterKey,
    totalAmount,
    filterData,
    setFilterData,
    groupExpenses,
    setSortedData,
    setGroupExpenses,
    setTotalSpents,
  } = useContext(AppContext)

  const [cookies] = useCookies(["groupId", "memberId", "memberName"])

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

  const dateChanged = (eve) => {
    const selectedDate = eve.target.value
    const filteredData = groupExpenses.flatMap((member) => {
      return member.dataByGroupMember
        .filter((expense) => {
          const createdDate = new Date(expense.createdAt).toLocaleDateString(
            "en-CA"
          )
          const updatedDate = new Date(expense.updatedAt).toLocaleDateString(
            "en-CA"
          )
          return createdDate === selectedDate || updatedDate === selectedDate
        })
        .map((expense) => ({
          ...expense,
          memberName: member.memberName,
        }))
    })

    setFilterData(filteredData)
  }
  const sortLoH = () => {
    const sortedLoH = [...filterData].sort((a, b) => {
      return a.amount - b.amount
    })
    setFilterData(sortedLoH)
  }
  const sortHoL = () => {
    const sortedHoL = [...filterData].sort((a, b) => {
      return b.amount - a.amount
    })
    setFilterData(sortedHoL)
  }

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

  const clearData = () => {
    setSearch("")
    setAmount("")
    setFilterData([])
  }

  const getMembersSpents = (memberId) => {
    const memberSpents = groupExpenses
      .filter((data) => memberId === data.memberId)
      .flatMap((data) => 
         data.dataByGroupMember.map((expense) => ({
          ...expense,
          memberName: data.memberName,
        }))
      )
    setFilterData(memberSpents)
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
                  onChange={(eve) => setSearch(eve.target.value)}
                  value={search}
                  type="text"
                  placeholder="Category"
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="expenseAmount">
                <input
                  id="amount"
                  onChange={(eve) => setAmount(eve.target.value)}
                  value={amount}
                  type="number"
                  placeholder="Amount"
                  onKeyPress={enterKey}
                />
              </div>
              <div className="expenseAdd">
                <button
                  // onClick={searchFilter}
                  id="addBtn"
                  className="addExpenseBtn"
                >
                  Search
                </button>
                <ToastContainer newestOnTop autoClose={2000} />
              </div>
              <div className={styles.filterOptions}>
                <div className={styles.filterBox}>
                  <div className={styles.filter}>Filter</div>
                  <div className={styles.sortByPrice}>
                    <p>Sort By Price</p>
                    <button className={styles.sortBylth} onClick={sortLoH}>
                      Low to High
                    </button>
                    <button className={styles.sortByhtl} onClick={sortHoL}>
                      High to Low
                    </button>
                  </div>
                  <div className={styles.groupMembersSpents}>
                    <p>Group Members Spents</p>
                    <select
                      onClick={(eve) => getMembersSpents(eve.target.value)}
                      className={styles.groupMember}
                    >
                      <option value="">---Select Member---</option>
                      {groupExpenses.map((data) => (
                        <option key={data._id} value={data.memberId}>{data.memberName}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.sortByDate}>
                    <p>Get Date</p>
                    <input
                      type="date"
                      className={styles.sortByDateInput}
                      onChange={dateChanged}
                    />
                  </div>
                  <div className={styles.clearBtnBox}>
                    <button className={styles.clearBtn} onClick={clearData}>
                      Clear Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="vline"></div>
          <hr className="vlineAfter" />

          <div className="middleRight">
            <div className={styles.middleRightTopTrack}>
              <div className={styles.budgetBoxTrack}>
                <span className="showBudget">Total : ₹{totalAmount}</span>
              </div>
            </div>
            <div className="middleRightBottom">
              <div className="myExpenses">My Expenses</div>
              <hr className="hr" />
              <ul className="expenseHeading">
                <li>
                  <span className="expenseName">Category</span>
                  <span className="expenseCost">Amount</span>
                  <span className="expenseCost">Member</span>
                  <span className="expenseDetails">Created</span>
                </li>
              </ul>
              <ul className="expenseData">
                {filterData.length > 0 ? (
                  filterData.map((data, index) => {
                    return (
                      <li key={index}>
                        <span className="expenseName">{data.category}</span>
                        <span className="expenseCost">{data.amount}</span>
                        <span className={styles.expenseName}>
                          {data.memberName}
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
                    Forget where your money went? 💸 Try this to track to get
                    remember your expenses with us! 📊
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

export default Track
