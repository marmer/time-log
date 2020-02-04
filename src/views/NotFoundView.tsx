import React from "react";

export interface NotFoundViewProps {
    location: string;
}

export default (props: NotFoundViewProps) => <div>
    <h1>Who told you about this location?</h1>
    <p>Nothing to see here at: <em>{props.location}</em></p>
</div>;
