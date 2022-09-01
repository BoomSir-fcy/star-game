import { TokenList } from '@uniswap/token-lists/dist/types';
import { ChainId } from 'dsgswap-sdk';
export interface ListsState {
    readonly byUrl: {
        readonly [url: string]: {
            readonly current: TokenList | null;
            readonly pendingUpdate: TokenList | null;
            readonly loadingRequestId: string | null;
            readonly error: string | null;
        };
    };
    readonly lastInitializedDefaultListOfLists?: string[];
    readonly activeListUrls: string[] | undefined;
    activeChainId: ChainId;
}
declare const _default: import("redux").Reducer<ListsState, import("redux").AnyAction>;
export default _default;
