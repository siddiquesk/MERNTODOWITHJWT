import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Componenets/Home";
import Login from "./Componenets/Login";
import Signup from "./Componenets/Signup";
import PageNotFound from "./Componenets/PageNotFound";
function App() {
  const token = localStorage.getItem("jwt");
  return (
    <>
      <div>
        <Routes>
          <Route
            path="/"
            element={token ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
