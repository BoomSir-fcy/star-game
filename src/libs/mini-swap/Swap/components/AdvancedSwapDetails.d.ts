/// <reference types="react" />
import { Trade } from 'dsgswap-sdk';
import { PolyData } from 'state/types';
export interface AdvancedSwapDetailsProps {
    trade?: Trade;
    polyData?: PolyData;
    isPolyMethed?: boolean;
}
export declare function AdvancedSwapDetails({ trade, isPolyMethed, polyData }: AdvancedSwapDetailsProps): JSX.Element;
