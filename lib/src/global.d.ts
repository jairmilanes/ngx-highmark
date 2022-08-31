export {};

interface Joypixels {
  shortnameToUnicode(input: string): string;
}

declare global {
  interface Window {
    joypixels: Joypixels
  }
}


