/// <reference types="react" />
export interface SlippageTabsProps {
    rawSlippage: number;
    setRawSlippage: (rawSlippage: number) => void;
    deadline: number;
    setDeadline: (deadline: number) => void;
    userUsePoly: boolean;
    setUserUsePoly: (deadline: boolean) => void;
    singleHopOnly: boolean;
    setSingleHopOnly: (deadline: boolean) => void;
}
export default function SlippageTabs({ rawSlippage, setRawSlippage, deadline, setDeadline, singleHopOnly, setSingleHopOnly, userUsePoly, setUserUsePoly }: SlippageTabsProps): JSX.Element;
