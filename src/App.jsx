import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import "./App.css";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Table from "./components/table";


import Login from "./pages/login";
import ProtectedRoute from "./components/ProtectedRoute";
import Forbidden from "./pages/Forbidden";
import ErrorPage from "./pages/ErrorPage";
import "../src/utils/api";

export default function App() {
  const [theme, setTheme] = useState("light");
  return (
    <div data-theme={theme}>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout theme={theme} setTheme={setTheme} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/organization" element={<Table endpoint="/api/organization" />} />
              <Route path="/teams" element={<Table endpoint="/api/organization/teams" />} />
              <Route path="/forbidden" element={<Forbidden />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
