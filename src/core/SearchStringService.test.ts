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

            describe("parameter values are URL encoded", () => {
                it("should decoded withing the result", async () => {
                    const result = SearchStringService.parse("?k1=a%20B,C%25D:e?f/g%5Ch");
                    expect(result).toStrictEqual({
                        k1: "a B,C%D:e?f/g\\h"
                    });

                });
            });

            describe("The given string does not start with a questionmark", () => {
                it("it should be assumed the given string is a search string just without a questionmark ", async () => {
                    const result = SearchStringService.parse("k1=v1");
                    expect(result).toStrictEqual({
                        k1: "v1"
                    });
                });
            });

            describe("parameter has an empty value assignment", () => {
                it("should be an empty result for the value", async () => {
                    const result = SearchStringService.parse("k1=");
                    expect(result).toStrictEqual({
                        k1: ""
                    });
                });
            });

            describe("parameter without any assignment", () => {
                it("should be an empty result for the value", async () => {
                    const result = SearchStringService.parse("k1");
                    expect(result).toStrictEqual({
                        k1: ""
                    });
                });
            });
        });
    });

    describe("toSearchString", () => {
        it("should serve a search string with all properties", async () => {
            expect(SearchStringService.toSearchString({k1: "v1", k2: "v2"})).toStrictEqual("?k1=v1&k2=v2")
        });

        it("should url encode property values", async () => {
            expect(SearchStringService.toSearchString({k1: "a B,C%D:e?f/g\\h"})).toStrictEqual("?k1=a%20B%2CC%25D%3Ae%3Ff%2Fg%5Ch")
        });
        it("should be possible to return an empty search string if the given object has no keys", async () => {
            expect(SearchStringService.toSearchString({})).toStrictEqual("?")
        });
        it("should set boolean properties explicitely", async () => {
            expect(SearchStringService.toSearchString({someProp: true})).toStrictEqual("?someProp=true")
        });
    });
});
