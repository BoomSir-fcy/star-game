/**
 * Format number of seconds into year, month, day, hour, minute, seconds
 *
 * @param seconds
 */
declare const getTimePeriods: (seconds: number) => {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};
export default getTimePeriods;
