import dayjs from "dayjs";

export const formatDateTime = (date: string) => {
  const now = dayjs();
  const messageDate = dayjs(date);

  if (now.diff(messageDate, "minute") < 1) return "Just now";
  if (now.diff(messageDate, "hour") < 1)
    return `${now.diff(messageDate, "minute")}minutes ago`;
  if (now.diff(messageDate, "day") < 1) return messageDate.format("h:mm A");
  if (now.diff(messageDate, "year") < 1)
    return messageDate.format("DDD/MM/YYYY h:mm A");
};
