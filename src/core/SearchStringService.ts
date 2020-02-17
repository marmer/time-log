export default class SearchStringService {

    static parse<T>(searchString: string): T {
        return this.removeSearchStringOpening(searchString)
            .split("&")
            .filter(kvPairs => kvPairs[0])
            .map(kvPair => kvPair.split("="))
            .map((([key, value]) =>
                ({[key]: value ? decodeURIComponent(value) : ""})))
            .reduce((aggregate, toAdd) =>
                ({...aggregate, ...toAdd}), {}) as any;
    }

    static toSearchString(requestProps: { [p: string]: string | number | boolean }) {

        if (!Object.keys(requestProps).length)
            return "?";

        return "?" + Object.keys(requestProps)
            .map((key: string) => key + "=" + encodeURIComponent(requestProps[key]))
            .reduce((previousValue, currentValue) => previousValue + "&" + currentValue);
    }

    private static removeSearchStringOpening(searchString: string) {
        return searchString.replace(/^\?/, "");
    }
}
