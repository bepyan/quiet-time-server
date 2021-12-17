type DateValue = string | Date | number;

const KO_DAY = ["일", "월", "화", "수", "목", "금", "토"];

const toTwoDigit = (v: string | number) => (+v < 10 ? "0" + v : "" + v);

export const getDateData = (target: DateValue) => {
  const time = new Date(target);
  return {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    date: time.getDate(),
    dayIdx: time.getDay(),
    day_ko: KO_DAY[time.getDay()],
    hour: time.getHours(),
    minute: time.getMinutes(),
    second: time.getSeconds(),
  };
};

export const getDateDataTwoDigit = (target: DateValue) => {
  const date = getDateData(target);
  return {
    ...date,
    year: date.year % 100,
    month: toTwoDigit(date.month),
    date: toTwoDigit(date.date),
    hour: toTwoDigit(date.hour),
    minute: toTwoDigit(date.minute),
    second: toTwoDigit(date.second),
  };
};

/**
 * @param target string | number | Date  `default` 오늘
 * @returns 2021-08-16
 */
export const toYMD = (target: DateValue = new Date()) => {
  if (!target) return "";
  const { year } = getDateData(target);
  const { month, date } = getDateDataTwoDigit(target);
  return `${year}-${month}-${date}`;
};

/**
 * @param target string | number | Date  `default` 오늘
 * @returns 2021-08-16 (월)
 */
export const toYMDD = (target: DateValue = new Date()) => {
  if (!target) return "";
  const { day_ko } = getDateData(target);
  return `${toYMD(target)} (${day_ko})`;
};

/**
 * @param target string | number | Date
 * @returns 2021년 3월 4일
 */
export const toYMD_KO = (target: DateValue = new Date()) => {
  if (!target) return "";
  const { year, month, date } = getDateData(target);
  return `${year}년 ${month}월 ${date}일`;
};
