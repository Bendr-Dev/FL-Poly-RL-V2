import React, { useContext, useState } from "react";
import { AuthContext } from "../App";
import { Redirect, Link } from "react-router-dom";
import { postData } from "../utils/http";
import { useForm } from "react-hook-form";

export default () => {
  const [authState, setAuthState] = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (e: any) => {
    try {
      setAuthState({
        loading: true,
      });

      const [error, response] = await postData("/api/users/login", formData);

      if (!!error) {
        if (error.status === 401) {
          setAuthState({
            isLoggedIn: false,
            user: {},
            loading: false,
          });
        }
      } else {
        response &&
          setAuthState({
            isLoggedIn: response.login,
            user: response.user,
            loading: false,
          });
      }
    } catch (err) {
      console.error(err);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-header">
            <h1>Login</h1>
          </div>
          <div className="line-break-primary"></div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              ref={register({
                required: "Email is required",
                pattern: /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/,
              })}
            />
            <div>
              {(errors.email?.type === "pattern" && (
                <small>* Email must be valid</small>
              )) ||
                (errors.email?.type === "required" && (
                  <small>* {errors.email?.message}</small>
                ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => onChange(e)}
              ref={register({
                required: "Password is required",
              })}
            />
            <div>
              {!!errors.password && <small>* {errors.password?.message}</small>}
            </div>
          </div>

          <div className="login-actions">
            <input className="btn" type="submit" value="LOGIN" />
            <span>
              Don't have an account already?{" "}
              <Link to="/register">Register Here</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
