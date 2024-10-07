import "./App.css"
import Login from "./components/login"
import SignUp from "./components/signup"
import Expenses from "./components/expenses"
import Dashboard from "./components/dashboard"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ValidateRoute from "./components/ValidateRoute"
import PrintPage from "./components/PrintPage"
import Track from "./components/Track";
import CreateGroup from "./components/CreateGroup";
import JoinGroup from "./components/JoinGroup";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/join-group" element={<JoinGroup />} />

          <Route
            path="/dashboard"
            element={
              <ValidateRoute>
                <Dashboard />
              </ValidateRoute>
            }
          />
          <Route
            path="/track"
            element={
              <ValidateRoute>
                <Track />
              </ValidateRoute>
            }
          />

          <Route
            path="/printexpenses"
            element={
              <ValidateRoute>
                <PrintPage />
              </ValidateRoute>
            }
          />
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
