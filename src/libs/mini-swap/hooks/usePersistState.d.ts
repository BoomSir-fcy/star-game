interface UsePersistStateOptions {
    localStorageKey: string;
    hydrate?: (value: any) => any;
    dehydrate?: (value: any) => any;
}
/**
 * Same as "useState" but saves the value to local storage each time it changes
 */
declare const usePersistState: (initialValue: any, userOptions: UsePersistStateOptions) => any[];
export default usePersistState;
