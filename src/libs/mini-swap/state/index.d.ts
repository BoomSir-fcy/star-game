declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    block: import("./types").BlockState;
    application: import("./application/reducer").ApplicationState;
    user: import("./user/reducer").UserState;
    transactions: import("./transactions/reducer").TransactionState;
    swap: import("./swap/reducer").SwapState;
    mint: import("./mint/reducer").MintState;
    burn: import("./burn/reducer").BurnState;
    multicall: import("./multicall/reducer").MulticallState;
    lists: import("./lists/reducer").ListsState;
}, import("redux").AnyAction, import("redux").Middleware<{}, any, import("redux").Dispatch<import("redux").AnyAction>>[]>;
/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export declare type AppDispatch = typeof store.dispatch;
export declare type AppState = ReturnType<typeof store.getState>;
export declare const useAppDispatch: () => import("redux").Dispatch<any>;
export default store;
