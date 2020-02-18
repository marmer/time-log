export default class WindowService {
    static reload() {
        window.location.reload();
    }

    static redirectTo(url: string) {
        window.location.href = url;
    }
}
