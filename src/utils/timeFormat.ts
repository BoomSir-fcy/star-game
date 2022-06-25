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

export const EasyformatTime = (time: number) => {
  if (time <= 0) {
    return '0h:00m:00s';
  }
  const hour = Math.floor(time / 3600).toString();
  let min = Math.floor((time % 3600) / 60).toString();
  let sec = (time % 60).toString();
  if (Number(min) < 10) {
    min = `0${min}`;
  }
  if (Number(sec) < 10) {
    sec = `0${sec}`;
  }
  return `${hour}h:${min}:${sec}`;
};
