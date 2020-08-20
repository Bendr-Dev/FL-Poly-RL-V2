import React, { useContext, useState } from "react";
import { AuthContext } from "../App";
import { Redirect } from "react-router-dom";
import { postData } from "../utils/http";

export default () => {
  const [authState, setAuthState] = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onSubmit = async (e: any) => {
    e.preventDefault();
    e.persist();
    try {
      setAuthState({
        loading: true,
      });

      const response = await postData("/api/users/login", formData);

      response &&
        setAuthState({
          isLoggedIn: response.login,
          user: response.user,
          loading: false,
        });
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        setAuthState({
          isLoggedIn: false,
          user: {},
        });
      }
    }
  };

  const onChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  if (authState.isLoggedIn) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="container">
      <div className="login-form">
        <form autoComplete="off" onSubmit={onSubmit}>
          <input type="hidden" value="prayer" />
          <div className="form-header">
            <h1>Login</h1>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              autoComplete="new-email"
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => onChange(e)}
            />
          </div>

          <input className="btn" type="submit" value="LOGIN" />
        </form>
      </div>
    </div>
  );
};
