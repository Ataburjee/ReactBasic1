// Navigation.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import Home from "./Home";
// import ModalExm from "./components/ModalExm";
import Login from "./Login";

import Signup from "./Signup";
// import TextForm from './components/TextForm';

function Navigator() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/:userId" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Navigator;
