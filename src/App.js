import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Typography } from "antd";
import GlobalLoader from "./components/GlobalLoader";
import AddModule from "./pages/AddModule";


const { Title, Text } = Typography;

function PlaceholderPage({ title }) {
  return (
    <>
      <Title level={2}>{title}</Title>
      <Text type="secondary">
        This module will be implemented here.
      </Text>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* Shared layout for authenticated pages */}
          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/patients"
              element={<PlaceholderPage title="Patients" />}
            />

            <Route
              path="/doctors"
              element={<PlaceholderPage title="Doctors" />}
            />

            <Route
              path="/appointments"
              element={<PlaceholderPage title="Appointments" />}
            />

            <Route
              path="/billing"
              element={<PlaceholderPage title="Billing" />}
            />
            <Route
              path="/createModule"
              element={<AddModule title="Create Module" />}
            />
          </Route>
        </Route>

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>

      <GlobalLoader />
    </BrowserRouter>
  );
}