import React, { useContext } from "react"
import Navbar from "./navbar"
import AppContext from "../context/AppContext"
import { ToastContainer } from "react-toastify"

const Track = () => {
  const {
    setSearch,
    search,
    setAmount,
    amount,
    handleKeyPress,
    enterKey,
    searchFilter,
    totalAmount,
    filterData,
  } = useContext(AppContext)

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
                  onClick={searchFilter}
                  id="addBtn"
                  className="addExpenseBtn"
                >
                  Search
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
                  <span className="expenseDetails">Created</span>
                </li>
              </ul>
              <ul className="expenseData">
                {filterData.length > 0 ? (
                  filterData.map((data) => {
                    return (
                      <li key={data._id}>
                        <span className="expenseName">{data.category}</span>
                        <span className="expenseCost">{data.amount}</span>

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
