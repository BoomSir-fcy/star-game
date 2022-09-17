import { TokenList } from '@uniswap/token-lists';
declare function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList>;
export default useFetchListCallback;
