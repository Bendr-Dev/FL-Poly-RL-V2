import React from "react";
import "./App.css";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./dashboard/Dashboard";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <div className="content-area">
        <Sidebar></Sidebar>
        <Dashboard></Dashboard>
      </div>
    </div>
  );
}

export default App;
