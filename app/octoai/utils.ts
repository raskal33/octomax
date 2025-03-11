/**
 * Calculates a date based on a relative day value
 * @param value A string representing the relative day (-3 to 0)
 * @returns An object with day, month, and year
 */
export function calculateDate(value: string): { day: number; month: number; year: number } {
  const today = new Date();
  
  // Get the current date in local timezone without time component
  const localDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Parse the day offset (0, -1, -2, -3)
  const dayOffset = parseInt(value, 10) || 0;
  
  // Apply the offset to the local date
  const targetDate = new Date(localDate);
  targetDate.setDate(localDate.getDate() + dayOffset);
  
  // Extract day, month, year components
  const result = {
    day: targetDate.getDate(),
    month: targetDate.getMonth() + 1, // JavaScript months are 0-indexed
    year: targetDate.getFullYear()
  };
  
  console.log('Calculated date for offset', value, ':', result);
  return result;
}

/**
 * Formats a date object into a string
 * @param date An object with day, month, and year
 * @returns A formatted date string (YYYY-MM-DD)
 */
export function formatDate(date: { day: number; month: number; year: number }): string {
  return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
}

/**
 * Gets a human-readable label for a day value
 * @param value A string representing the relative day (-3 to 0)
 * @returns A human-readable day label
 */
export function getDayLabel(value: string): string {
  switch (value) {
    case "0":
      return "Today";
    case "-1":
      return "Yesterday";
    case "-2":
      return "2 Days Ago";
    case "-3":
      return "3 Days Ago";
    default:
      return "Today";
  }
} 