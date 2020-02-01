import React from "react";

export interface DayViewProps {
    day: string;
}

export default function DayView(props: DayViewProps) {
    return <div>Day
        <p>{props.day}</p></div>
}
