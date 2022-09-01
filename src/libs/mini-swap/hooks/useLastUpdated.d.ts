/**
 * A helper hook to keep track of the time between events
 * Can also be used to force an effect to re-run
 */
declare const useLastUpdated: () => {
    lastUpdated: number;
    previousLastUpdated: undefined;
    setLastUpdated: () => void;
};
export default useLastUpdated;
