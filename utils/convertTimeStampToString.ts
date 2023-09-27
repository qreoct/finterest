import { Timestamp } from "firebase/firestore"

// Assuming `timestamp` is your Firebase Timestamp

export function convertTimestampToString(timestamp: Timestamp): string {
  // Convert the Firebase Timestamp to a JavaScript Date object
  const date: Date = timestamp.toDate();

  // Format the date as a string (e.g., "MM/DD/YYYY HH:mm:ss")
  const dateString: string = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

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
