import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Plants from "./pages/Plants";
import Tasks from "./pages/Tasks";
import HealthRecords from "./pages/HealthRecords";
import Consultations from "./pages/Consultations";
import Community from "./pages/Community";
import Species from "./pages/Species";
import Environment from "./pages/Environment";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Landing Screen */}
                <Route path="/" element={<Landing />} />

                {/* Public Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes wrapped with Layout (Navbar + Main content) */}
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/plants" element={<Plants />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/health-records" element={<HealthRecords />} />
                    <Route path="/consultations" element={<Consultations />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/species" element={<Species />} />
                    <Route path="/environment" element={<Environment />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Unknown Route Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;