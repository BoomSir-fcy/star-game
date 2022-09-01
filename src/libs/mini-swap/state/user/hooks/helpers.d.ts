import { Token } from 'dsgswap-sdk';
import { SerializedToken } from '../actions';
export declare function serializeToken(token: Token): SerializedToken;
export declare function deserializeToken(serializedToken: SerializedToken): Token;
