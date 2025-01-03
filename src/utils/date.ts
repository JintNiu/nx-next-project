export const getWeek = (date: Date) => {
  const weekNumber = Math.ceil(
    (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
  ); // 根据当前日期与年初之间的天数计算所在的周数
  return weekNumber;
};
