export default class SearchStringService {

    static parse<T>(searchString: string): T {
        return this.removeSearchStringOpening(searchString)
            .split("&")
            .filter(kvPairs => kvPairs[0])
            .map(kvPair => kvPair.split("="))
            .reduce((result, kvPair) => {
                    result[kvPair[0]] = kvPair[1] ? decodeURIComponent(kvPair[1]) : "";
                    return result;
                }
                , {} as { [key: string]: string }) as any;
    }

    static toSearchString(requestProps: { [p: string]: string | number | boolean }) {

        if (!Object.keys(requestProps).length)
            return "?";

        return "?" + Object.keys(requestProps)
            .map((key: string) => {
                return key + "=" + encodeURIComponent(requestProps[key])
            }).reduce((previousValue, currentValue) =>
                previousValue ?
                    previousValue + "&" + currentValue :
                    currentValue);
    }

    private static removeSearchStringOpening(searchString: string) {
        return searchString.replace(/^\?/, "");
    }
}
