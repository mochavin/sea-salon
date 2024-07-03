import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractHourMinute(timeString: string | undefined) {
  // Check if timeString is defined and is a string
  if (typeof timeString === 'string') {
    const matches = timeString.match(/\{"(\d{2})","(\d{2})"\}/);
    if (matches) {
      return { hour: matches[1], minute: matches[2] };
    }
  }
  // Return null or a default value if timeString is undefined or not a string
  return null;
}

export const fetchData = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};
