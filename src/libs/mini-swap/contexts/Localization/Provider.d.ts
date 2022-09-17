import React from 'react';
import { ContextApi } from './types';
export declare const languageMap: Map<string, Record<string, string>>;
export declare const LanguageContext: React.Context<ContextApi>;
export declare const LanguageProvider: React.FC<{
    lang?: string;
}>;
