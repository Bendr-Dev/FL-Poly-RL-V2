import React, { useContext, useState, useEffect } from "react";
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
      const response = await postData("/api/users/login", formData);

      setAuthState({
        isLoggedIn: response.login,
        user: response.user,
      });
      console.log(authState);
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
    <div className="login-form">
      <form onSubmit={onSubmit}>
        <h1>Login</h1>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>

        <input type="submit" value="login" />
      </form>
    </div>
  );
};
