export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  // Normalize dates (ignore time)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const messageDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (messageDay.getTime() === today.getTime()) {
    return time; // Today → "11:45 PM"
  } else if (messageDay.getTime() === yesterday.getTime()) {
    return `Yesterday, ${time}`; // Yesterday → "Yesterday, 11:45 PM"
  } else {
    const datePart = date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
    return `${datePart}, ${time}`; // Older → "Nov 14, 10:32 AM"
  }
};
