import React from "react";
import {useParams} from "react-router-dom";

export default function DayView() {
    return <div>Day
        <p>{useParams()}</p></div>
}
