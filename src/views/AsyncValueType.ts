export type AsyncValueType<T> = {
    loadingState: "LOADING";
} | {
    loadingState: "ERROR";
    error: Error;
} | {
    loadingState: "DONE";
    value: T;
};
