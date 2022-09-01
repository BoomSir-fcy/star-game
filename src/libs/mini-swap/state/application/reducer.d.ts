export interface ApplicationState {
    readonly blockNumber: {
        readonly [chainId: number]: number;
    };
}
declare const _default: import("redux").Reducer<ApplicationState, import("redux").AnyAction>;
export default _default;
