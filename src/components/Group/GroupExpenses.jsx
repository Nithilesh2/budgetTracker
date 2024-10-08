import React, { useContext } from 'react'
import GroupNavbar from './GroupNavbar';
import AppContext from '../../context/AppContext';
import ClipLoader from 'react-spinners/ClipLoader';
import { ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

const GroupExpenses = () => {

  const {setCategory,category,handleKeyPress,setAmount, amount,enterKey,loadingInExpensePage,loadingDelete } = useContext(AppContext)

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
                    // onClick={addExpenses}
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
                <div className="showSpents">Spent: ₹{}</div>
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
                  <span className="expenseAction">User</span>
                  <span className="expenseDetails">Created</span>
                </li>
              </ul>
              <ul className="expenseData">
              {/* <li>
                  <span className="expenseName">Water</span>
                  <span className="expenseCost">150</span>
                  <span className="expenseAction">De</span>
                  <span className="expenseAction">KA</span>
                  <span className="expenseDetails">17-12-2004</span>
                </li>
                <li>
                  <span className="expenseName">Food</span>
                  <span className="expenseCost">1500</span>
                  <span className="expenseAction">De</span>
                  <span className="expenseAction">AK</span>
                  <span className="expenseDetails">12-24-2003</span>
                </li> */}
                {/* {expenses.length > 0 ? (
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
                )} */}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default GroupExpenses
