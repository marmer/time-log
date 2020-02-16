import UserRepository from "./UserRepository";
import {User} from "../core/UserService";
import Lockr from "lockr";

const userBase: User = {
    email: "me@you.com"
};
describe("UserRepository", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("getCurrentUser", () => {
        describe("User exists", () => {
            it("should return the user", async () => {
                Lockr.set("user", {...userBase});

                const currentUser = UserRepository.getCurrentUser();

                expect(currentUser).toStrictEqual(userBase)
            });
        });
        describe("User does not exist", () => {
            it("should return nothing", async () => {
                const currentUser = UserRepository.getCurrentUser();

                expect(currentUser).toBeNull()
            });
        });

    });
});