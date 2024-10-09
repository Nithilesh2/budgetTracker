import "./App.css"
import Login from "./components/login"
import SignUp from "./components/signup"
import Expenses from "./components/expenses"
import Dashboard from "./components/dashboard"
import { Routes, Route, Navigate } from "react-router-dom"
import ValidateRoute from "./components/ValidateRoute"
import PrintPage from "./components/PrintPage"
import Track from "./components/Track";
import CreateGroup from "./components/Group/CreateGroup";
import JoinGroup from "./components/Group/JoinGroup";
import GroupExpenses from "./components/Group/GroupExpenses";
import GroupDashboard from "./components/Group/GroupDashboard";
import GroupTrack from "./components/Group/GroupTrack";

function App() {
  return (
    <>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/join-group" element={<JoinGroup />} />
          <Route path="/expenses-group" element={<GroupExpenses />} />
          <Route path="/dashboard-group" element={<GroupDashboard />} />
          <Route path="/track-group" element={<GroupTrack />} />

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
    </>
  )
}

export default App
