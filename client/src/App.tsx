import React, { createContext, useState, useEffect } from "react";
import "./App.css";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./dashboard/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { getData } from "./utils/http";

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

  const history = useHistory();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthState({
          ...authState,
          loading: true,
        });

        const response = await getData("/api/users/me");

        !!response &&
          setAuthState({
            isLoggedIn: true,
            user: response.user,
            loading: false,
          });

        authState.loading && history.push("/dashboard");
      } catch (err) {
        if (err.status === 401) {
          setAuthState({
            isLoggedIn: false,
            user: {},
            loading: false,
          });
          authState.loading && history.push("/login");
        }
      }
    };
    checkAuth();
    // authState.loading && redirectTo();
  }, []);

  const redirectTo = () => {
    if (authState.isLoggedIn) {
      return <Redirect to="/dashboard" />;
    } else {
      return <Redirect to="/login" />;
    }
  };

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
                path={["/dashboard", "/"]}
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
