import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to generate random integer between a range
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Arrays of words to combine for the username
const adjectives = ['Cool', 'Funky', 'Brave', 'Clever', 'Shiny', 'Swift', 'Lucky'];
const nouns = ['Tiger', 'Phoenix', 'Explorer', 'Wizard', 'Knight', 'Lion', 'Nomad'];

export function generateUsername(): string {
  const randomAdjective = adjectives[getRandomInt(0, adjectives.length - 1)];
  const randomNoun = nouns[getRandomInt(0, nouns.length - 1)];
  const randomNumber = getRandomInt(10, 99); // Add a random number at the end for uniqueness

  return `${randomAdjective}${randomNoun}${randomNumber}`;
}