import React, { FunctionComponent } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface IPropTypes extends RouteProps {
  isLoggedIn: boolean;
  component: FunctionComponent<any>;
}

const ProtectedRoute = ({
  component: Component,
  isLoggedIn,
  ...rest
}: IPropTypes) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !isLoggedIn ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
  );
};

export default ProtectedRoute;
