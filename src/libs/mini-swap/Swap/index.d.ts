import React from 'react';
export interface SwapInterface {
    inputCurrencyId?: string;
    outputCurrencyId?: string;
    subTitleTips?: React.ReactNode;
    powered?: React.ReactNode;
    titlehelper?: string;
}
export default function Swap({ inputCurrencyId, outputCurrencyId, subTitleTips, titlehelper, powered }: SwapInterface): JSX.Element;
