import React from "react";

export default () => {
    return <form onSubmit={_ => false}>
        <div className="card">
            <div className="card-header">
                Day Settings
            </div>
            <div className="form-group row card-body">
                <label htmlFor="expectedTimeToLog">Expected Time to log per day in Minutes</label>
                <input id="expectedTimeToLog" type="number" className="form-control"
                       placeholder="e.g. 480 for 8 hours"/>
            </div>
        </div>
        <button className="btn btn-primary fullWidth" title="save"
                type={"submit"}
        >save
        </button>
    </form>
}
