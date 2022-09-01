import getTimePeriods from './getTimePeriods';
/**
 * @param {Object} periods Return value from getTimePeriods
 * @param excludePeriods Key list for the object values of that exclude the periods
 * @return {string} '14h 3m 4s'
 */
declare const formatTimePeriod: (periods: ReturnType<typeof getTimePeriods>, excludePeriods?: any[]) => string;
export default formatTimePeriod;
