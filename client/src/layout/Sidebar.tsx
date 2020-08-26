import React from "react";
import { NavLink } from "react-router-dom";

export default () => {
  return (
    <nav className="side-nav">
      <div className="route">
        <NavLink to="/dashboard" activeClassName="selected-route">
          <span className="route-content">
            <i className="fa fa-home" /> Dashboard
          </span>
        </NavLink>
      </div>

      <div className="route">
        <NavLink
          to="/tournaments"
          activeClassName="selected-route"
          className="route"
        >
          <span className="route-content">
            <i className="fa fa-trophy" /> Tournaments
          </span>
        </NavLink>
      </div>
    </nav>
  );
};
