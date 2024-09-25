import "./App.css"
import Login from "./components/login"
import SignUp from "./components/signup"
import Expenses from "./components/expenses"
import Dashboard from "./components/dashboard"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ValidateRoute from "./components/ValidateRoute"
import PrintPage from "./components/PrintPage"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/printexpenses" element={<PrintPage />} />
          <Route
            path="/dashboard"
            element={
              <ValidateRoute>
                <Dashboard />
              </ValidateRoute>
            }
          />
          {/* <Route
            path="/printexpenses"
            element={
              <ValidateRoute>
                <PrintPage />
              </ValidateRoute>
            }
          /> */}
          <Route
            path="/expenses"
            element={
              <ValidateRoute>
                <Expenses />
              </ValidateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
