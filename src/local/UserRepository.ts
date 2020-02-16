import {User} from "../core/UserService";
import Lockr from "lockr";

export default class UserRepository {

    static getCurrentUser(): User | null {
        return Lockr.get("user", null);
    }

    static setCurrentUser(user: User) {
        Lockr.set("user", user);
    }
}
