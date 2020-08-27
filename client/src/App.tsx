import React, { createContext, useState, useEffect } from "react";
import "./App.css";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./dashboard/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import Alert, { IAlertState, createAlert } from "./utils/Alert";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { getData } from "./utils/http";
import { Tournament } from "./tournament/Tournament";
import { TeamStat } from "./stat/TeamStat";
import { PlayerStat } from "./stat/PlayerStat";

export interface IAuthState {
  isLoggedIn: boolean;
  user: any;
  loading: boolean;
}

export const AlertContext = createContext([
  {
    alerts: [],
  },
  () => {},
] as [IAlertState, any]);

export const AuthContext = createContext([{}, () => {}] as [IAuthState, any]);

export default () => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: {},
    loading: true,
  });
  const [alertState, setAlertState] = useState<IAlertState>({
    alerts: [],
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // calling this with a function need for dependency
        setAuthState((currentState) => {
          return {
            ...currentState,
            loading: true,
          };
        });

        const [error, response] = await getData("/api/users/me");

        setAlertState((currentState) => {
          return {
            alerts: [...currentState.alerts],
          };
        });
        if (error) {
          if (error.status === 401) {
            setAuthState({
              isLoggedIn: false,
              user: {},
              loading: false,
            });
          }
        } else {
          !!response &&
            setAuthState({
              isLoggedIn: true,
              user: response,
              loading: false,
            });
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkAuth();
  }, []);

  return (
    <AlertContext.Provider value={[alertState, setAlertState]}>
      <AuthContext.Provider value={[authState, setAuthState]}>
        <Router>
          <div className="App">
            {/* <Navbar></Navbar> */}
            <div className="content-area">
              <Sidebar></Sidebar>
              {!authState.loading ? (
                <Switch>
                  <ProtectedRoute
                    exact
                    path={["/dashboard", "/"]}
                    component={Dashboard}
                    isLoggedIn={authState.isLoggedIn}
                    loading={authState.loading}
                  />
                  <ProtectedRoute
                    exact
                    path="/tournaments"
                    component={Tournament}
                    isLoggedIn={authState.isLoggedIn}
                    loading={authState.isLoggedIn}
                  />
                  <ProtectedRoute
                    exact
                    path="/teamstats"
                    component={TeamStat}
                    isLoggedIn={authState.isLoggedIn}
                    loading={authState.isLoggedIn}
                  />
                  <ProtectedRoute
                    exact
                    path="/playerstats"
                    component={PlayerStat}
                    isLoggedIn={authState.isLoggedIn}
                    loading={authState.isLoggedIn}
                  />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/register" component={Register} />
                </Switch>
              ) : (
                <span>loading {authState.loading.toString()}</span>
              )}
            </div>
          </div>
        </Router>
        <Alert></Alert>
      </AuthContext.Provider>
    </AlertContext.Provider>
  );
};
