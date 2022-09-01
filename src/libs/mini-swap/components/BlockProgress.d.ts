import React from 'react';
import { ProgressProps } from 'pancake-uikit';
interface BlockProgressProps extends ProgressProps {
    startBlock: number;
    endBlock: number;
}
declare const BlockProgress: React.FC<BlockProgressProps>;
export default BlockProgress;
