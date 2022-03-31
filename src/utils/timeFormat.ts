import dayjs from 'dayjs';

export const formatTime = (time: string | number, format?: string) => {
  if (typeof time === 'number') {
    return dayjs.unix(time).format(format || 'YYYY-MM-DD HH:mm:ss');
  }

  return dayjs(time).format(format || 'YYYY-MM-DD HH:mm:ss');
};

export const formatUTC = (time?: string | number, format?: string) => {
  return dayjs(time || new Date())
    .utc()
    .format(format);
};
