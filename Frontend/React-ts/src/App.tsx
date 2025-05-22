//import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./features/Login/pages/Login";
import Inicio from "./features/Inicio/pages/Inicio";

export default function App() {
  return (
    <Routes>
      <Route index element={<Login />}></Route>
      <Route path="/Inicio" element={<Inicio />}></Route>
    </Routes>
  );
}
