export function formatDuration(seconds: number) {
  // Calculate the number of days, hours, minutes, and seconds
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hrs = Math.floor(seconds / 3600);
  seconds -= hrs * 3600;
  const mins = Math.floor(seconds / 60);
  seconds -= mins * 60;

  // Create an array to hold the formatted parts
  const parts = [];

  // Add the parts to the array if they are greater than 0
  if (days > 0) {
    parts.push(days + (days > 1 ? " days" : " day"));
  }
  if (hrs > 0) {
    parts.push(hrs + (hrs > 1 ? " hours" : " hour"));
  }
  if (mins > 0) {
    parts.push(mins + (mins > 1 ? " minutes" : " minute"));
  }
  if (seconds > 0) {
    parts.push(seconds + (seconds > 1 ? " seconds" : " second"));
  }

  // If there's nothing in the parts array, then the duration was 0 seconds
  if (parts.length === 0) {
    return "0 seconds";
  }

  // Join the parts into a string and return it
  return parts.join(", ");
}

export function timestampToHumanDate(timestamp: number) {
  // Create a new Date object with the Unix timestamp
  const date = new Date(timestamp * 1000);

  // Format the date into a human friendly string
  return date.toLocaleString();
}
