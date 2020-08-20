import React, { useContext, useState } from "react";
import { AuthContext } from "../App";
import { postData } from "../utils/http";
import { Redirect, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

export default () => {
  const [authState, setAuthState] = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    discordId: "",
    steam64Id: "",
    password: "",
    password2: "",
    role: "Guest",
  });

  const {
    name,
    username,
    email,
    discordId,
    steam64Id,
    password,
    password2,
  } = formData;

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (e: any) => {
    try {
      setAuthState({
        loading: true,
      });

      const response = await postData("/api/users/register", formData);

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
      <div className="register-form">
        <div className="form-header">
          <h1>Register</h1>
        </div>
        <div className="line-break-primary"></div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Please Enter Your Name"
                name="name"
                value={name}
                onChange={(e) => onChange(e)}
                ref={register({
                  required: "Name is required",
                })}
              />
              <div>
                {!!errors.name && <small>* {errors.name?.message}</small>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name">Email</label>
              <input
                type="email"
                placeholder="Please Enter Your Email"
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
              <label htmlFor="name">Username</label>
              <input
                type="text"
                placeholder="Please Enter Your Username"
                name="username"
                value={username}
                onChange={(e) => onChange(e)}
                ref={register({
                  required: "Username is required",
                })}
              />
              <div>
                {!!errors.username && (
                  <small>* {errors.username?.message}</small>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name">Discord ID</label>
              <input
                type="text"
                placeholder="Please Enter Your Discord ID"
                name="discordId"
                value={discordId}
                onChange={(e) => onChange(e)}
                ref={register({
                  required: "Discord ID is required",
                })}
              />
              {!!errors.discordId && (
                <small>* {errors.discordId?.message}</small>
              )}
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label htmlFor="name">Steam64ID</label>
              <input
                type="text"
                placeholder="Please Enter Your Steam64ID"
                name="steam64Id"
                value={steam64Id}
                onChange={(e) => onChange(e)}
                ref={register({
                  required: "Steam64ID is required",
                })}
              />
              <div>
                {!!errors.steam64Id && (
                  <small>* {errors.steam64Id?.message}</small>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Please Enter a Password"
                name="password"
                value={password}
                onChange={(e) => onChange(e)}
                ref={register({
                  required: "Password is required",
                })}
              />
              <div>
                {(errors.password?.type === "validate" && (
                  <small>* Passwords must match</small>
                )) ||
                  (errors.password?.type === "required" && (
                    <small>* {errors.password?.message}</small>
                  ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password2">Confirm Password</label>
              <input
                type="password"
                placeholder="Please Enter the same Password Again"
                name="password2"
                value={password2}
                onChange={(e) => onChange(e)}
                ref={register({
                  required: "Confirm password is required",
                  validate: (value: string) => {
                    return value === password;
                  },
                })}
              />
              <div>
                {(errors.password2?.type === "validate" && (
                  <small>* Passwords must match</small>
                )) ||
                  (errors.password2?.type === "required" && (
                    <small>* {errors.password2?.message}</small>
                  ))}
              </div>
            </div>

            <div className="register-actions">
              <input className="btn" type="submit" value="REGISTER" />
              <span>
                Already have an account? <Link to="/login">Login Here</Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
