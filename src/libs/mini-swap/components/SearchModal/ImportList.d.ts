/// <reference types="react" />
import { TokenList } from '@uniswap/token-lists';
interface ImportProps {
    listURL: string;
    list: TokenList;
    onImport: () => void;
}
declare function ImportList({ listURL, list, onImport }: ImportProps): JSX.Element;
export default ImportList;
