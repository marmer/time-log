const requestObject = decodeURI(window.location.hash)
    .replace(/^#/, "")
    .split("&")
    .map(value => value.split("="))
    .map(kv => {
        const retVal = {};
        retVal[kv[0]] = kv[1]
        return retVal;
    })
    .reduce((previousValue, currentValue) => ({...previousValue, ...currentValue}));

window.location.href = "/#/login/google?" + JSON.stringify(requestObject);
