import moment from "moment-timezone";
import "moment/locale/ko";

type DateValue = string | Date | number;

const KO_DAY = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * @param target string | number | Date  `default` 오늘
 * @returns 2021-08-16
 */
export const toYMD = (target: DateValue = new Date()) => {
  return moment(target).tz("Asia/Seoul").format("YYYY-MM-DD");
};

export const toYMDD = (target: DateValue = new Date()) => {
  return moment(target).tz("Asia/Seoul").format("YYYY년 MM월 DD일 dddd");
};
