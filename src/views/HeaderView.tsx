import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import projectConfiguration from "../../package.json"
import {Link, NavLink} from "react-router-dom";

export default () => <header>
    <nav className="navbar navbar-dark bg-dark">
        <Link to={"/days/today"} className="navbar-brand">
            <img src="/logo192.png" width="30" height="30"
                 className="d-inline-block align-top" alt="logo">
            </img> {projectConfiguration.name}</Link>
        <div className="navbar-expand">
            <div className="navbar-nav">
                <NavLink to={"/days/today"}
                         isActive={(match, location) => location.pathname.startsWith("/day")}
                         className="nav-item nav-link"
                         activeClassName="active">Logs</NavLink>
                <NavLink to={"/settings"} className="nav-item nav-link" activeClassName="active">Settings</NavLink>
            </div>
        </div>
    </nav>
</header>;


