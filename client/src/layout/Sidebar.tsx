import React from "react";
import { NavLink } from "react-router-dom";

export default () => {
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

      <div className="route">
        <NavLink to="/teamstats" activeClassName="selected-route">
          <div>
            <div className="route-content">
              <div>
                <i className="fa fa-users" />
              </div>
              <div>
                <span>Team</span>
              </div>
            </div>
          </div>
        </NavLink>
      </div>

      <div className="route">
        <NavLink to="/playerstats" activeClassName="selected-route">
          <div>
            <div className="route-content">
              <div>
                <i className="fa fa-user" />
              </div>
              <div>
                <span>Players</span>
              </div>
            </div>
          </div>
        </NavLink>
      </div>

      <div className="footer">
        <div>Account</div>
        <div>Sign out</div>
      </div>
    </nav>
  );
};
