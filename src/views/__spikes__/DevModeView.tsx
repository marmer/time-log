import GoogleDriveSpikeView from "./GoogleDriveSpikeView";
import React from "react";
import UserView from "../UserView";

export default function DevModeView() {
    return localStorage.getItem("devMode") ? <div className="devMode">
        <UserView/>
        <GoogleDriveSpikeView/>
    </div> : <></>
}
