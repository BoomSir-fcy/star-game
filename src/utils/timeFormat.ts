import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
  const day = Math.floor(time / (60 * 60 * 24));
  let hour = (Math.floor(time / 3600) - day * 24).toString();
  let min = Math.floor((time % 3600) / 60).toString();
  let sec = (time % 60).toString();
  if (Number(hour) < 10) {
    hour = `0${hour}`;
  }
  if (Number(min) < 10) {
    min = `0${min}`;
  }
  if (Number(sec) < 10) {
    sec = `0${sec}`;
  }
  const dayText = `${day}d:${hour}h:${min}m`;
  const hourText = `${hour}h:${min}m:${sec}s`;
  return `${day > 0 ? dayText : hourText}`;
};
