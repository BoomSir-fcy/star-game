import { PayloadAction } from '@reduxjs/toolkit';
import { BlockState } from '../types';
export declare const blockSlice: import("@reduxjs/toolkit").Slice<BlockState, {
    setBlock: (state: import("immer/dist/internal").WritableDraft<BlockState>, action: PayloadAction<number>) => void;
}, "Block">;
export declare const setBlock: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<number, string>;
declare const _default: import("redux").Reducer<BlockState, import("redux").AnyAction>;
export default _default;
