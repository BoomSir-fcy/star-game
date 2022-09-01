import React from 'react';
interface Props {
    title: string;
    subtitle?: string;
    helper?: string;
    backTo?: string;
    tips?: React.ReactNode;
    noConfig?: boolean;
    hideSetting?: boolean;
}
declare const AppHeader: React.FC<Props>;
export default AppHeader;
