import React from "react";
import UserService from "../core/UserService";


export default () => {
    const missingEnvironmentVariables = UserService.getMissingEnvironmentVariables();
    if (missingEnvironmentVariables && missingEnvironmentVariables.length) return <section>
        <strong>Server Missconfiguration. Set the following environment variables are not set properly:</strong>
        {missingEnvironmentVariables.map(envVar => <div key={envVar}>{envVar}</div>)}
    </section>;

    const currentUser = UserService.getCurrentUser();
    return currentUser ? (
        <section>
            <p>{currentUser.email}</p>
            <button>Logout</button>
        </section>
    ) : (
        <section>
            <button onClick={() => UserService.redirectToLogin()}>
                Login
            </button>
        </section>
    )
};
