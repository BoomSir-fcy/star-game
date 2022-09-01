import { ContextApi } from 'contexts/Localization/types';
import { PageMeta } from './types';
export declare const DEFAULT_META: PageMeta;
export declare const getCustomMeta: (path: string, t: ContextApi['t']) => PageMeta;
