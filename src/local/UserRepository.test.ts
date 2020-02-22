import UserRepository from "./UserRepository";
import {User} from "../core/UserService";
import Lockr from "lockr";

const userBase: User = {
    email: "me@you.com",
    accessToken: "123"
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

    describe("setCurrentUser", () => {
        it("should save a new current user", async () => {
            UserRepository.setCurrentUser({...userBase});

            const storedCurrentUser = Lockr.get("user");
            expect(storedCurrentUser).toStrictEqual(userBase);
        });

        it("should override any existing user", async () => {
            Lockr.set("user", {...userBase, email: "oldMail"} as User);
            UserRepository.setCurrentUser({...userBase, email: "newMail"});

            const storedCurrentUser = Lockr.get("user");
            expect(storedCurrentUser).toStrictEqual({...userBase, email: "newMail"});
        });
    });

    describe("removeCurrentUser", () => {
        Lockr.set("user", {...userBase});

        UserRepository.removeCurrentUser();

        expect(localStorage.getItem("user")).toBeNull();
    });
});
