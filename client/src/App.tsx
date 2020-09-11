import React, { createContext, useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./dashboard/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import Alert, { IAlertState } from "./utils/Alert";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { getData } from "./utils/http";
import { Tournament } from "./tournament/Tournament";
import { TeamStat } from "./stat/TeamStat";
import { PlayerStat } from "./stat/PlayerStat";
import Modal from "./utils/Modal";
import { IUser } from "./common/User.Interface";

export interface IAuthState {
  isLoggedIn: boolean;
  user: any;
  loading: boolean;
}

export interface IModalComponentProps {
  componentState?: any;
  onSubmit?: () => {};
  onModalCleanup: () => void;
  onCancel?: () => {};
  onClickOutside?: () => {};
}

export interface IModalState {
  display: boolean;
  ModalChild: React.FC<IModalComponentProps> | null;
  data: Partial<IModalComponentProps>;
}

export const AlertContext = createContext<
  [IAlertState, React.Dispatch<React.SetStateAction<IAlertState>>]
>([
  {
    alerts: [],
  },
  () => {},
]);

export const AuthContext = createContext<
  [IAuthState, React.Dispatch<React.SetStateAction<IAuthState>>]
>([
  {
    isLoggedIn: false,
    user: {},
    loading: true,
  },
  () => {},
]);
export const ModalContext = createContext<
  [IModalState, React.Dispatch<React.SetStateAction<IModalState>>]
>([
  {
    display: false,
    ModalChild: null,
    data: {},
  },
  () => {},
]);

export default () => {
  const [authState, setAuthState] = useState<IAuthState>({
    isLoggedIn: false,
    user: {},
    loading: true,
  });
  const [alertState, setAlertState] = useState<IAlertState>({
    alerts: [],
  });
  const [modalState, setModalState] = useState<IModalState>({
    display: false,
    ModalChild: null,
    data: {},
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

        const [error, response] = await getData<IUser>("/api/users/me");

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
        console.error(err);
      }
    };
    checkAuth();
  }, []);

  return (
    <AlertContext.Provider value={[alertState, setAlertState]}>
      <AuthContext.Provider value={[authState, setAuthState]}>
        <ModalContext.Provider value={[modalState, setModalState]}>
          <Router>
            <div className="App">
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
                  <span className="loading-spinner"></span>
                )}
              </div>
            </div>
          </Router>
          <Modal></Modal>
          <Alert></Alert>
        </ModalContext.Provider>
      </AuthContext.Provider>
    </AlertContext.Provider>
  );
};
