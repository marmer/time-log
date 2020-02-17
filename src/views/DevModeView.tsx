import GoogleDriveSpikeView from "./GoogleDriveSpikeView";
import React from "react";

export default function DevModeView() {
    return localStorage.getItem("devMode") ? <div className="devMode"><GoogleDriveSpikeView/></div> : <></>
}
