import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import projectConfiguration from "../../package.json"

export default () => <header>
    <nav className="navbar navbar-dark bg-dark">
        <span className="navbar-brand mb-0 h1">{projectConfiguration.name}</span>
    </nav>

</header>;


