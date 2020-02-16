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

    private static removeSearchStringOpening(searchString: string) {
        return searchString.replace(/^\?/, "");
    }
}
