import React, { createContext, useState } from "react";
import "./App.css";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./dashboard/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";

export interface IAuthState {
  isLoggedIn: boolean;
  user: any;
}

export const AuthContext = createContext([{}, () => {}] as [IAuthState, any]);

export default () => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: {},
    loading: false,
  });
  return (
    <AuthContext.Provider value={[authState, setAuthState]}>
      <Router>
        <div className="App">
          <Navbar></Navbar>
          <div className="content-area">
            <Sidebar></Sidebar>
            <Switch>
              <ProtectedRoute
                exact
                path="/dashboard"
                component={Dashboard}
                isLoggedIn={authState.isLoggedIn}
                loading={authState.loading}
              />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
            </Switch>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};
