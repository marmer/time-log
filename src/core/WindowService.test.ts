import WindowService from "./WindowService";

describe("WindowService", () => {
    describe("reload", () => {
        it("should reload the page", async () => {
            window.location.reload = jest.fn();

            WindowService.reload();

            expect(window.location.reload).toBeCalled();
        });
    });
});
