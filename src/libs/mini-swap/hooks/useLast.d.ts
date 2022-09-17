/**
 * Returns the last truthy value of type T
 * @param value changing value
 */
declare function useLastTruthy<T>(value: T | undefined | null): T | null | undefined;
export default useLastTruthy;
