import React, { FunctionComponent } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface IPropTypes extends RouteProps {
  isLoggedIn: boolean;
  component: FunctionComponent<any>;
  loading: boolean;
}

const ProtectedRoute = ({
  component: Component,
  isLoggedIn,
  loading,
  ...rest
}: IPropTypes) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return !isLoggedIn ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
};

export default ProtectedRoute;
