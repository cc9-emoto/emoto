import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./styles/Reset.scss";
import "./styles/App.scss";
import Index from "./pages/Index.js";
import Dashboard from "./pages/Dashboard.js";
import Onboarding from "./pages/Onboarding.js";
import Animation from "./pages/Animation.js";

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Index} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/animation" component={Animation} />
    </Router>
  );
};

export default App;
