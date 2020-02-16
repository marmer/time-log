import SearchStringService from "./SearchStringService";

describe("SearchStringService", () => {
    describe("parse", () => {
        describe("valid search string with one parameter given", () => {
            it("it should return an object with the given key", async () => {
                const result = SearchStringService.parse("?k1=v1");
                expect(result).toStrictEqual({
                    k1: "v1"
                });
            });
            describe("valid search string with one parameter given", () => {
                it("it should return an object with the all given keys", async () => {
                    const result = SearchStringService.parse("?k1=v1&k2=v2");
                    expect(result).toStrictEqual({
                        k1: "v1",
                        k2: "v2"
                    });
                });
            });

            describe("valid search string with no parameter given", () => {
                it("should return an empty object", async () => {
                    const result = SearchStringService.parse("?");
                    expect(result).toStrictEqual({});
                });
            });

            // TODO: marmer 16.02.2020 malformed uri component
            // TODO: marmer 16.02.2020 malformed search String (no ? at the beginning)
            // TODO: marmer 16.02.2020 not value for one of the parameters
            // TODO: marmer 16.02.2020 empty search string
        });
    });
});
