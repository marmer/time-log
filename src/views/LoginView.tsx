import React from "react";
import RemoteLoginService, {LoginResult} from "../core/RemoteLoginService";
import {Redirect} from "react-router-dom";

export interface LoginViewProps {
    searchString: string;
}


export default class LoginView extends React.Component<LoginViewProps, { loginResult?: LoginResult, loginError?: Error }> {


    constructor(props: Readonly<LoginViewProps>) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        RemoteLoginService.loginBySearchString(this.props.searchString)
            .then(loginResult => this.setState({
                loginResult
            }))
            .catch(loginError => this.setState({loginError}))
    }

    render() {
        if (this.state.loginResult) {
            return <Redirect to={this.state.loginResult?.sourceUrl}/>
        } else if (this.state.loginError) {
            return <div>Error while trying to log you in. Reason: {this.state.loginError?.message}</div>
        } else {
            return <div>requesting user data...</div>;
        }
    }
}
