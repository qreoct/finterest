export function convertTimestampToString(timestamp: string): string {
  const date: Date = new Date(timestamp);

  // Format the date as a string (e.g., "MM/DD/YYYY")
  const dateString: string = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  // ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return dateString;
}

// Returns current date in YYYY-MM-DD format
export function getCurrentDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}
