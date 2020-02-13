import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import UserView from "./UserView";
import projectConfiguration from "../../package.json"

export default () => <header>
    <h1>{projectConfiguration.name}</h1>
    <UserView/>
</header>;


