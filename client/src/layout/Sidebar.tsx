import React, { useContext } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { AuthContext } from "../App";

export default () => {
  const [auth, setAuth] = useContext(AuthContext);

  const signout = () => {
    try {
      setAuth({
        isLoggedIn: false,
        user: {},
        loading: false
      });
      
      return (<Redirect to="/login" />);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <nav className="side-nav">
      <div>
        <h2>Florida Poly RL</h2>
      </div>
      <div className="route">
        <NavLink to="/dashboard" activeClassName="selected-route">
          <div>
            <div className="route-content">
              <div>
                <i className="fa fa-home" />
              </div>
              <div>
                <span>Dashboard</span>
              </div>
            </div>
          </div>
        </NavLink>
      </div>

      <div className="route">
        <NavLink to="/tournaments" activeClassName="selected-route">
          <div>
            <div className="route-content">
              <div>
                <i className="fa fa-trophy" />
              </div>
              <div>
                <span>Tournaments</span>
              </div>
            </div>
          </div>
        </NavLink>
      </div>

      <div className="footer">
        <div onClick={() => { signout() }}>Sign out</div>
      </div>
    </nav>
  );
};
